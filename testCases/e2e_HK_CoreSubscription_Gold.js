// import sample data
const data = require('../dataFactory/data');
const product = require('../dataFactory/product');

// load required scripts from library
const login = require('../library/login');
const logout = require('../library/logout');
const account = require('../stepDefinition/account');
const contact = require('../stepDefinition/contact');
const b2b = require('../stepDefinition/billingInformation');
const oppty = require('../stepDefinition/opportunity');
const quote = require('../stepDefinition/quote');
const nav = require('../library/genericfunctions');
const order = require('../stepDefinition/order');
const constantValues = require('../library/constants');
const assert = require('../library/assertHelper');


describe('e2e_HK_CoreSubscription_Gold', function() {
  this.timeout(constantValues.TIMEOUT_LONG_SEC);
  // local variable for browser and page to be used for a test
  let accountName, contactName, opportunityName, browser, page, quoteNumber, quoteDetails,
    billingDetails, orderNumber, frame;
  const goldAgent = product.productsHK.coreSubscription.goldAgent;


  before(async() => {
    // Code to launch chrome and return browser
    browser = await login.launchchrome();
    // code to login into salesforce and return page to be used further in test
    page = await login.loginToSalesforce(browser, constantValues.TEST_HK_USER_KEY, constantValues.TEST_HK_PASSWORD_KEY);
  });


  it('Account Creation', async function() {
    this.retries(1);
    await account.createAccount(page, data.businessAccount('Hong Kong'));
    await assert.assertUsingVisualForceMessage(page, 'was created');
    accountName = await account.captureAccountName(page);
  });

  it('Contact Creation', async function() {
    await contact.createContactFromAccount(page, data.contactFromAccount('Hong Kong'));
    await assert.assertUsingVisualForceMessage(page, 'was created');
    contactName = await contact.captureContactName(page);
  });

  it('Billing Information Creation', async function() {
    await b2b.createB2BBillingInformation(page, contactName, data.b2bBillingInformation('Hong Kong','Hong Kong'));
    await assert.assertUsingVisualForceMessage(page, 'was created');
  });

  it('Billing Information Submit for Approval', async function() {
    await b2b.b2bSubmitForApproval(page, accountName);
    await assert.assertUsingVisualForceMessage(page, 'was submitted for approval');
    await b2b.assertBIStatus(page, 'Draft');
    billingDetails = await b2b.captureBillingDetails(page);
  });

  it('Opportunity Creation', async function() {
    await oppty.createOpportunity(page, accountName, contactName, accountName, data.opportunity('HKD - Hong Kong Dollar'));
    await assert.assertUsingVisualForceMessage(page, 'was created');
    opportunityName = await oppty.captureOpportunityName(page);
  });

  it('Quote Creation', async function() {
    await quote.createQuoteFromOpportunity(page);
    await assert.assertUsingVisualForceMessage(page, 'was created');
    quoteNumber = await quote.captureQuoteName(page);
  });

  it('CPQ Add Products', async function() {
    this.retries(1);
    await nav.globalSearch(page, quoteNumber, 'Quotes');
    frame = await quote.editProductline(page);
    await quote.addProducts(page, frame, goldAgent.productName);
    await quote.configAttributes(page, frame, goldAgent);
    await quote.quoteLineSave(page, frame);
    await quote.dateInput(frame);
    await quote.changeDiscount(page, frame, goldAgent.productName, goldAgent.discount, 'Incremental Spend', '');
    await quote.clickCalculateButton(frame);
    await quote.searchAgent(frame,contactName);
    await quote.quoteLineSave(page, frame);
    console.log(`Products have been added`);
  });

  it('Edit Quote Payment Details', async function() {
    await quote.editPaymentDetailsWithRetry(page, quoteNumber, 'Approved', 'Cash', false);
  });

  it('Generate Quote Document', async function() {
    this.retries(1);
    await quote.generateDocument(page);
  });

  it('Convert Quote into Order', async function() {
    this.retries(1);
    await nav.globalSearch(page, quoteNumber, 'Quotes');
    await order.createOrder(page, false);
    await assert.assertUsingVisualForceMessage(page, 'Your Order has been created. You can access this order by navigating to the Orders related list on this Quote.');
    orderNumber = await order.captureOrderName(page);
    console.log(`Order : ${orderNumber} was created`);

  });

  it('Logout Sales User', async function() {
    await logout.logoutsalesforce(browser);
  });

  it('Login as Finance User', async function() {
    browser = await login.launchchrome();
    page = await login.loginToSalesforce(browser, constantValues.TEST_FINANCE_USER_KEY, constantValues.TEST_FINANCE_USER_PASSWORD_KEY);
  });

  it('Billing Information Approval', async function() {
    await nav.globalSearch(page, accountName, 'Billing Information');
    await b2b.financeBIApproval(page);
    await assert.assertUsingVisualForceMessage(page, 'Billing Information was approved');
    await b2b.assertBIStatus(page, 'Active');

  });

  it('Order Validation and Activation', async function() {
    await nav.globalSearch(page, quoteNumber, 'Quotes');
    quoteDetails = await quote.captureQuoteDetails(page);
    await quote.relatedOrder(page, true);
    await order.validateOrderDetails(page, quoteDetails, billingDetails);
    await order.financeOrderActivation(page);
    await assert.assertUsingVisualForceMessage(page, 'Order has been Activated');
  });

  after(async() => {
    await logout.logoutsalesforce(browser);
  });
});


