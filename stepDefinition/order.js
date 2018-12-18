// declare constant variables
const nav = require('../library/genericfunctions');
const quote = require('../stepDefinition/quote');

// import object properties
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('properties/object.Properties');

// import chai
const chai = require('chai');
const assert = chai.assert;

const hashMap = require('hashmap');
const constantValues = require('../library/constants');

/** *********************************************************************
 Function Name: createQuoteFromOpportunity()
 Description: This function will create quote from opportunity and save it
 Date:
 Author:
 Modified:
 ************************************************************************/


export async function createOrder(page, primary = true){
  try {

    await nav.click(page,'Create Order');
    if (primary){
      await nav.checkBoxInput(page, 'Primary');
    }
    await page.waitFor(constantValues.TIMEOUT_2_SEC);
    await page.waitForXPath(properties.get('createOrder.billToName.text'));
    await nav.footerbutton(page, 'Save');
  } catch (error) {
    await nav.screenShot(page, 'Create Order Page');
    console.log(error);
    assert.fail(error);
  }
}

export async function captureOrderName(page){
  // code to fetch the order number which have been created
  try {
    return await quote.relatedOrder(page);
  } catch (error) {
    return await quote.relatedOrder(page);
  }
}


export async function financeOrderActivation(page){
  try {
    await nav.click(page,'Activate');
    await page.waitForXPath(properties.get('createOrder.order.activate.waitfor'));
    await nav.footerbutton(page, 'Save');
  } catch (error) {
    await nav.screenShot(page, 'Order activation page');
    console.log(error);
    assert.fail(error);
  }
}

export async function validateOrderDetails(page, quoteDetailsMap, billingDetailsMap){
  const orderDetailsMap = new hashMap();
  try {
    await page.waitFor(constantValues.TIMEOUT_2_SEC);
    orderDetailsMap.set('Order Amount', await nav.getDetailsPageFieldValues(page, 'Order Amount', properties.get('generic.details.fieldName')));
    orderDetailsMap.set('Order Start Date', await nav.getDetailsPageFieldValues(page, 'Order Start Date', properties.get('generic.details.fieldName')));
    orderDetailsMap.set('Billing Street', await nav.getDetailsPageFieldValues(page, 'Billing Street', properties.get('generic.details.fieldName')));
    orderDetailsMap.set('Billing City/Suburb', await nav.getDetailsPageFieldValues(page, 'Billing City/Suburb', properties.get('generic.details.fieldName')));
    orderDetailsMap.set('Billing State/Province', await nav.getDetailsPageFieldValues(page, 'Billing State/Province', properties.get('generic.details.fieldName')));
    orderDetailsMap.set('Billing Zip/Postal Code', await nav.getDetailsPageFieldValues(page, 'Billing Zip/Postal Code', properties.get('generic.details.fieldName')));
    orderDetailsMap.set('Billing Country', await nav.getDetailsPageFieldValues(page, 'Billing Country', properties.get('generic.details.fieldName')));
    await nav.reload(page);
    await page.waitFor(constantValues.TIMEOUT_1_SEC);
    orderDetailsMap.set('Status', await nav.getDetailsPageFieldValues(page, 'Status', properties.get('generic.details.fieldName')));
    assert.equal(nav.formatAmount(orderDetailsMap.get('Order Amount')), nav.formatAmount(quoteDetailsMap.get('Net Amount')), 'Validate amount');
    assert.equal(orderDetailsMap.get('Order Start Date'), quoteDetailsMap.get('Start Date'), 'Validate start date');
    assert.equal(orderDetailsMap.get('Billing Street'), billingDetailsMap.get('Billing Street'), 'Validate billing street');
    assert.equal(orderDetailsMap.get('Billing City/Suburb'), billingDetailsMap.get('Billing City/Suburb'), 'Validate city');
    assert.equal(orderDetailsMap.get('Billing State/Province'), billingDetailsMap.get('Billing State/Province'), 'Validate state');
    assert.equal(orderDetailsMap.get('Billing Zip/Postal Code'), billingDetailsMap.get('Billing Zip/Postal Code'), 'Validate postal code');
    assert.equal(orderDetailsMap.get('Billing Country'), billingDetailsMap.get('Billing Country'), 'Validate country');
    assert.equal(orderDetailsMap.get('Status'), 'Draft', 'Validate status');

  } catch (error){
    await nav.screenShot(page);
    console.log(error);
    assert.fail(error);
  }

}

export async function navigateToOrderFromQuote(page, ordernumber){
  try {
    await nav.relatedTab(page, 'Related');
    await nav.scrollDown(page);
    await nav.xpathClick(page, properties.get('createOrder.order.number'));
  } catch (error) {
    await nav.screenShot(page, 'Navigate to Order from quote failed');
    console.log(error);
    assert.fail(error);
  }

}