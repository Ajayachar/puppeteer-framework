const nav = require('../library/genericfunctions');
const chai = require('chai');
const assert = chai.assert;

export async function assertUsingVisualForceMessage(page, expectedMessage){
  // code to wait for visual force message is displayed
  const message = await nav.waitForVisualForceMessage(page);
  assert.include(message, expectedMessage, 'Text message \'' + message + '\' from browser is not matching with expected value \'' + expectedMessage + '\'' + '\n');
  console.log(`Asserted: ${message}`);
}

export async function assertErrorMsgEditPaymentDetails(page,property, expectedMessage){
  const errorMsg = await nav.getInnerText(page, property);
  assert.include(errorMsg, expectedMessage);
  console.log(`Asserted: ${expectedMessage}`);

}