
const nav = require('../library/genericfunctions');

// import chai
const chai = require('chai');
const assert = chai.assert;

// import object properties
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('properties/object.Properties');
const constantValues = require('../library/constants');

/** *********************************************************************
 Function Name: createaccount()
 Description: This function will create account and save it
 Date:
 Author:
 Modified:
 ************************************************************************/
export async function createAccount(page, accountdata){

  try {

    await nav.click(page, 'Accounts');

    // code to reclick on account if it fails on first attempt
    let visible = await nav.isVisible(page, properties.get('account.new.Button'));
    let counter = 0;
    while (visible === false) {
      console.log('First time click on account failed');
      await page.waitFor(constantValues.TIMEOUT_2_SEC);
      await nav.click(page, 'Accounts');
      visible = await nav.isVisible(page, properties.get('account.new.Button'));
      counter++;
      if (counter === 10) {
        break;
      }
    }
    // code to retry clicking on new button
    try {
      await nav.click(page, 'New');
    } catch (error){
      await nav.click(page, 'Accounts');
      await nav.click(page, 'New');
    }
    await page.waitFor(constantValues.TIMEOUT_2_SEC);
    const heading = await nav.getInnerText(page, properties.get('account.create.account.heading'));
    if (heading === 'New Account'){
      await selectAccountType(page, accountdata.accountType);
    }
    await nav.fillForm(page, accountdata);
    await nav.click(page, 'Save');
  } catch (error) {
    await nav.screenShot(page, 'Account Page');
    console.log(error);
    assert.fail(error);
  }

}

async function selectAccountType(page, recordType){

  await nav.selectRecordType(page,recordType);
  await nav.footerbutton(page,'Next');

}

export async function captureAccountName(page){
  return await nav.getInnerText(page, properties.get('account.accountName.heading'));
}