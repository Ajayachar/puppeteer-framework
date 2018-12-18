// declare constant variables
const nav = require('../library/genericfunctions');

// import sample data
const data = require('../dataFactory/data');

// import object properties
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('properties/object.Properties');

// import chai
const chai = require('chai');
const assert = chai.assert;
// Using Assert style

const hashMap = require('hashmap');
const constantValues = require('../library/constants');

/** *********************************************************************
 Function Name: createB2BBillingInformation()
 Description: This function will create billing information and save it
 Date:
 Author:
 Modified:
 ************************************************************************/

export async function createB2BBillingInformation(page, contactname, billingData) {

  try {
    await nav.click(page, 'Add Billing Information');
    await nav.fillForm(page, billingData);
    await nav.search(page, 'Billing Contact Name', contactname);
    await nav.footerbutton(page, 'Save');
  } catch (error) {
    await nav.screenShot(page, 'Billing Information Page');
    console.log(error);
    assert.fail(error);
  }
}

/** *********************************************************************
 Function Name: b2bSubmitForApproval()
 Description: This function will Submit the Billing Information for Approval
 Date:
 Author:
 Modified:
 ************************************************************************/

export async function b2bSubmitForApproval(page, accountName) {

  try {
    await nav.scrollDown(page);
    await nav.xpathClick(page, properties.get('billingInformation.billingInformation.name'));

    // verify if the status is new
    const billingStatus = await nav.getInnerText(page, properties.get('billingInformation.billingInformationStatus.text'));
    assert.equal(billingStatus, 'New', 'Verifying if billing information status is new');

    await nav.click(page, 'Submit for Approval');
    await nav.textArea(page, 'Comments', 'Please approve');
    await nav.footerbutton(page, 'Submit');
  } catch (error) {
    await nav.screenShot(page, 'Billing Information Page');
    console.log(error);
    assert.fail(error);
  }

}

export async function assertBIStatus(page, status){

  // refresh the page as dom will have old and new status
  await nav.reload(page);
  await page.waitFor(constantValues.TIMEOUT_4_SEC);
  await nav.relatedTab(page, 'Details');
  await page.waitFor(constantValues.TIMEOUT_2_SEC);
  const billingStatus = await nav.getDetailsPageFieldValues(page, 'Status', properties.get('generic.details.fieldName'));
  assert.equal(billingStatus, status, 'Verifying if billing information status has changed to ' + status);
}

/** *********************************************************************
 Function Name: b2bCancelForApproval()
 Description: This function will Cancel the Billing Information for Approval
 Date:
 Author:
 Modified:
 ************************************************************************/

export async function b2bSubmitForApprovalAndCancel(page, value) {

  try {
    await nav.xpathClick(page, properties.get('billingInformation.billingInformation.name'));
    await nav.click(page, 'Submit for Approval');
    await nav.textArea(page, 'Comments', 'Please approve');
    await nav.footerbutton(page, 'Cancel');
    await nav.lookUpLink(page, 'Account', value);
    await nav.relatedTab(page);
  } catch (error) {
    console.log(error);
    assert.fail(error);
  }

}

/** *********************************************************************
 Function Name: createAlternateBilling()
 Description: This function will create Alternate billing information and save it
 Date:
 Author:
 Modified:
 ************************************************************************/

export async function createAlternateBilling(page, contactname, alternateBillingData) {

  try {
    await nav.relatedTab(page, 'Related');
    await nav.relatedNewButton(page, 'Alternative Billing Contacts');
    await nav.fillForm(page, alternateBillingData);
    await nav.search(page, 'Billing Contact', contactname);
    await nav.footerbutton(page, 'Save');

    // code to wait for message Alternate billing is created
    const message = await nav.waitForVisualForceMessage(page);

    // verify account is created
    assert.include(message, 'was created', 'check for Alternate billing Contact creation');
    return await nav.getInnerText(page, properties.get('alternateBillingContact.alternateBiilingName'));

  } catch (error) {
    console.log(error);
    assert.fail(error);
  }


}

/** *********************************************************************
 Function Name: alternateSubmitForApproval()
 Description: This function will Submit the Alternate Billing  for Approval
 Date:
 Author:
 Modified:
 ************************************************************************/

export async function alternateSubmitForApproval(page, value) {

  try {
    await nav.xpathClick(page, properties.get('alternateBillingContact.alternateBiilingName'));

    // refresh the page to load all the buttons and wait for Alternate Billing Contact Text to appear on the page
    await nav.reload(page);
    await page.waitForXPath(properties.get('alternateBillingContact.alternate.pagewait'));

    // verify if the status is new
    const billingStatus = await nav.getInnerText(page, properties.get('alternateBillingContact.billingInformationStatus.altpage'));
    console.log(`Billing Information Status : ${billingStatus}`);

    if (billingStatus === 'Active') {
      await nav.click(page, 'Submit for Approval');
      await nav.textArea(page, 'Comments', 'Please approve');
      await nav.footerbutton(page, 'Submit');
      const message1 = await nav.waitForVisualForceMessage(page);

      // verify alternate billing contact is submitted for approval
      assert.include(message1, 'was submitted for approval.', 'check whether billing information was submitted for approval');

      // navigate back to Account
      await nav.globalSearchResultsClick(page, value, 'Accounts');
      await nav.relatedTab(page, 'Related');

    } else if (billingStatus !== 'Active') {
      await nav.click(page, 'Submit for Approval');
      await nav.textArea(page, 'Comments', 'Please approve');
      await nav.footerbutton(page, 'Submit');
      await page.waitForXPath(properties.get('alternateBillingContact.validationMessage'));

      // Verify the validation error message
      const errorMessage = await nav.getInnerText(page, properties.get('alternateBillingContact.validationMessage'));
      console.log(`Validation Error Message : ${errorMessage}`);
      assert.equal(errorMessage, 'No applicable approval process was found.', 'Verifying the Validation Error Message');
      await nav.modalButton(page);

      await nav.reload(page);
      await page.waitForXPath(properties.get('alternateBillingContact.alternate.pagewait'));
      await nav.globalSearchResultsClick(page, value, 'Accounts');
      await nav.relatedTab(page, 'Related');
    }
  } catch (error) {
    console.log(error);
    assert.fail(error);
  }

}

/** *********************************************************************
 Function Name: alternateCancel()
 Description: This function will Cancel the Alternate Billing for Approval
 Date:
 Author:
 Modified:
 ************************************************************************/

export async function alternateSubmitForApprovalAndCancel(page, value) {
  try {
    await nav.xpathClick(page, properties.get('alternateBillingContact.alternateBiilingName'));
    await nav.click(page, 'Submit for Approval');
    await nav.textArea(page, 'Comments', 'Please approve');
    await nav.footerbutton(page, 'Cancel');
    await nav.globalSearchResultsClick(page, value, 'Account');
    await nav.relatedTab(page, 'Related');
  } catch (error) {
    console.log(error);
  }
}

/** *********************************************************************
 Function Name: financeBIApproval()
 Description: This function will finance approve billing information
 Date:
 Author:
 Modified:
 ************************************************************************/

export async function financeBIApproval(page){

  try {
    const status = await nav.getDetailsPageFieldValues(page, 'Status', properties.get('generic.details.fieldName'));
    assert.include(status, 'Draft', 'check if billing information status is draft');
    await nav.relatedTab(page, 'Related');
    await nav.xpathClick(page, properties.get('billingInformation.billingInformation.approval'));
    await nav.textArea(page, 'Comments', 'Approved');
    await nav.footerbutton(page, 'Approve');
  } catch (error) {
    await nav.screenShot(page, 'Finance User Billing Information Page');
    console.log(error);
  }

}

export async function captureBillingDetails(page){

  const billingDetailsMap = new hashMap();

  try {
    billingDetailsMap.set('Billing Street', await nav.getDetailsPageFieldValues(page, 'Billing Street', properties.get('generic.details.fieldName')));
    billingDetailsMap.set('Billing City/Suburb', await nav.getDetailsPageFieldValues(page, 'Billing City/Suburb', properties.get('generic.details.fieldName')));
    billingDetailsMap.set('Billing State/Province', await nav.getDetailsPageFieldValues(page, 'Billing State/Province', properties.get('generic.details.fieldName')));
    billingDetailsMap.set('Billing Zip/Postal Code', await nav.getDetailsPageFieldValues(page, 'Billing Zip/Postal Code', properties.get('generic.details.fieldName')));
    billingDetailsMap.set('Billing Country', await nav.getDetailsPageFieldValues(page, 'Billing Country', properties.get('generic.details.fieldName')));
    return billingDetailsMap;
  } catch (error){
    await nav.screenShot(page);
    console.log(error);
    assert.fail(error);
  }
}