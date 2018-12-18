// declare constant variables
const nav = require('../library/genericfunctions');

// import object properties
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('properties/object.Properties');

// import chai
const chai = require('chai');
const assert = chai.assert;

const constantValues = require('../library/constants');
/** *********************************************************************
Function Name: createcOpportunity()
Description: This function will create Opportunity and save it
Date:
Author:
Modified:
************************************************************************/

export async function createOpportunity(page, accountName, contactName, billingInformation, opportunityData) {

  try {
    await nav.click(page, 'Opportunities');
    await nav.click(page, 'New');
    const heading = await nav.getInnerText(page, properties.get('account.create.account.heading'));
    if (heading === 'New Opportunity') {
      await nav.selectRecordType(page, 'Agent Opportunity Record Type');
      await nav.footerbutton(page, 'Next');
    }
    await nav.fillForm(page, opportunityData);
    // select contact and billing information
    await nav.search(page, 'Billing Information', billingInformation);
    await nav.search(page, 'Sale Contact', contactName);
    await nav.search(page, 'Account Name', accountName);
    await nav.click(page, 'Save');
  } catch (error) {
    await nav.screenShot(page);
    console.log(error);
    assert.fail(error);
  }


}

export async function captureOpportunityName(page){
  // code to fetch the opportunity name which have been created
  try {
    return await nav.getInnerText(page, properties.get('opportunity.opportunityName.heading'));
  } catch (e){
    return await nav.getInnerText(page, properties.get('opportunity.opportunityName.heading.error'));
  }
}


/** *********************************************************************
 Function Name: createcOpportunityFromAccount()
 Description: This function will create Opportunity from account and save it
 Date:
 Author:
 Modified:
 ************************************************************************/

export async function createOpportunityFromAccount(page, contactName, billingInformation, opportunityData) {

  try {
    await page.waitFor(constantValues.TIMEOUT_2_SEC);
    await page.waitFor(constantValues.TIMEOUT_1_SEC);
    await nav.relatedTab(page, 'Related');
    await nav.relatedNewButton(page, 'Opportunities');
    const heading = await nav.getInnerText(page, properties.get('account.create.account.heading'));
    if (heading === 'New Opportunity') {
      await nav.selectRecordType(page, 'Agent Opportunity Record Type');
      await nav.footerbutton(page, 'Next');
    }
    await nav.fillForm(page, opportunityData);

    // select contact and billing information
    await nav.search(page, 'Billing Information', billingInformation);
    await nav.search(page, 'Sale Contact', contactName);
    await nav.click(page, 'Save');
  } catch (error) {
    await nav.screenShot(page);
    console.log(error);
    assert.fail(error);
  }

}

export async function captureOpportunityNameFromAccount(page){
  return await nav.getInnerText(page, properties.get('opportunity.opportunityNameFromAccount.heading'));
}

/** *********************************************************************
 Function Name: navigateToOpportunityFromAccount()
 Description: This function will navigate to Opportunity from account
 Date:
 Author:
 Modified:
 ************************************************************************/

export async function navigateToOpportunityFromAccount(page) {
  try {
    await page.waitFor(2000);
    await nav.xpathClick(page, properties.get('opportunity.opportunityNameFromAccount.heading'));
    console.log('Navigated to Opportunity page');
  } catch (error) {
    await nav.screenShot(page);
    console.log(error);
  }

}