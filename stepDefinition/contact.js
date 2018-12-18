// declare constant variables
const nav = require('../library/genericfunctions');

// import object properties
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('properties/object.Properties');

// import chai
const chai = require('chai');
const assert = chai.assert;


/** *********************************************************************
Function Name: createcontact()
Description: This function will create contact and save it
Date:
Author:
Modified:
************************************************************************/

export async function createContact(page, contactData, accountName){

  try {
    await nav.click(page,'Contacts');
    await nav.click(page,'New');
    // Step to search and add account should be scripted
    await nav.fillForm(page,contactData);
    await nav.search(page,'Account Name', accountName);
    await nav.click(page,'Save');
  } catch (error) {
    await nav.screenShot(page);
    console.log(error);
    assert.fail(error);
  }

}

/** *********************************************************************
 Function Name: createContactFromAccount()
 Description: This function will create contact from account and save it
 Date:
 Author:
 Modified:
 ************************************************************************/

export async function createContactFromAccount(page, contactData){

  try {
    await nav.relatedTab(page, 'Related');
    await nav.relatedNewContact(page,'New Contact');
    await nav.fillForm(page,contactData);
    await nav.click(page,'Save');
  } catch (error) {
    await nav.screenShot(page);
    console.log(error);
    assert.fail(error);
  }

}

export async function captureContactName(page){
  return await nav.getInnerText(page, properties.get('contact.contactName.heading'));
}