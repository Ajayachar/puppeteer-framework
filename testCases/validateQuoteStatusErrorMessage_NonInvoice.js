
// load required scripts from library
const login = require('../library/login');
const logout = require('../library/logout');
const account = require('../stepDefinition/account');
const contact = require('../stepDefinition/contact');
const oppty = require('../stepDefinition/opportunity');
const b2b = require('../stepDefinition/billingInformation');
const constantValues = require('../library/constants');
const assert = require('../library/assertHelper');
const quote = require('../stepDefinition/quote');
const data = require('../dataFactory/data');


// import object properties
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('properties/object.Properties');

let browser,
    page, quoteNumber,accountName, contactName;


// repeat same test for multiple data
const multiplelogin = [
  {user: constantValues.TEST_HK_USER_KEY, password: constantValues.TEST_HK_PASSWORD_KEY},
  {user: constantValues.TEST_MY_DEVELOPER_USER_KEY, password: constantValues.TEST_MY_DEVELOPER_USER_PASSWORD_KEY}
];


multiplelogin.forEach(({user, password}) => {

  describe(`Validate Error Message on Payment Details: ` + user, function() {
    this.timeout(constantValues.TIMEOUT_LONG_SEC);
    before(async() => {
      // Code to luanch chrome and return browser
      browser = await login.launchchrome();
      // code to login into salesforce and return page to be used further in test
      page = await login.loginToSalesforce(browser, user, password);
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

    it('Opportunity Creation', async function() {
      await oppty.createOpportunityFromAccount(page, contactName, accountName , data.opportunity('HKD - Hong Kong Dollar'));
      await assert.assertUsingVisualForceMessage(page, 'was created');
      await oppty.navigateToOpportunityFromAccount(page);
    });

    it('Quote Creation', async function() {
      await quote.createQuoteFromOpportunity(page);
      await assert.assertUsingVisualForceMessage(page, 'was created');
      quoteNumber = await quote.captureQuoteName(page);
      await quote.editPaymentDetails(page, quoteNumber,'Draft','Cash',false);
      await  assert.assertErrorMsgEditPaymentDetails(page,properties.get('generic.error.list'),
          'This Quote has not been Approved/Accepted yet. Please change the Payment type back to \'Invoice\' AND/OR remove the Reference number', 'Validate error message in quote');
    });

    after(async() => {
      await logout.logoutsalesforce(browser);
    });

  });
});

