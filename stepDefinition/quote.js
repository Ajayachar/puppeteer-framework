// declare constant variables
const nav = require('../library/genericfunctions');
const cpq = require('../library/cpqFunctions');
const hashMap = require('hashmap');
const faker = require('faker/locale/en_AU');


// import sample data
const data = require('../dataFactory/data');

// import object properties
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('properties/object.Properties');
const constantValues = require('../library/constants');


// import chai
const chai = require('chai');
const assert = chai.assert;

/** *********************************************************************
 Function Name: createQuoteFromOpportunity()
 Description: This function will create quote from opportunity and save it
 Date:
 Author:
 Modified:
 ************************************************************************/
export async function createQuoteFromOpportunity(page, primary = true) {
  try {
    await nav.click(page, 'New Quote');
    if (primary) {
      await nav.checkBoxInput(page, 'Primary');
    }
    await nav.footerbutton(page, 'Save');
  } catch (error) {
    await nav.screenShot(page);
    console.log(error);
    assert.fail(error);
  }

}

export async function captureQuoteName(page){
  await nav.relatedTab(page, 'Related');
  return await nav.getInnerText(page, properties.get('quote.quoteNumber.heading'));
}

export async function editProductline(page) {

  try {
    await nav.click(page, 'Edit Product Lines');
    // Switch to iframe and check priceBook dialog message
    return await cpq.priceBook(page);
  } catch (error) {
    await nav.screenShot(page);
    console.log(error);
    assert.fail(error);
  }

}

export async function addProducts(page, frame, product) {
  try {
    await cpq.buttonClick(frame, properties.get('cpq.cpq.button'), 'Add Products');
    await frame.waitForXPath(properties.get('cpq.spinner'), {hidden: false});
    await cpq.waitForSpinner(frame);
    await cpq.enter(frame, properties.get('cpq.searchProducts.textbox'), product);
    await selectingProducts(page,frame,product);
    await cpq.waitForSpinner(frame);
    const checkboxXpath = nav.replaceXpath(properties.get('cpq.searchProduct.checkbox'), product);
    await cpq.click(frame, checkboxXpath);
    await cpq.buttonClick(frame, properties.get('cpq.cpq.button'), 'Select');
    await cpq.waitForSpinner(frame);
    console.log('Added ' + product + ' Successfully');
  } catch (error) {
    await nav.screenShot(page);
    console.log(error);
    assert.fail(error);
  }
}

export async function selectingProducts(page,frame,product){
  try {
    await page.waitFor(constantValues.TIMEOUT_2_SEC);
    const divsCounts = await frame.$x('//div[@id=\'selector\']//div');
    if (divsCounts.length > 1) {
      await cpq.buttonClick(frame, properties.get('cpq.searchProducts.selector'), product);
    } else {await cpq.click(frame, properties.get('cpq.searchProducts.button'));}
  } catch (error) {
    await nav.screenShot(page);
    console.log(error);
    assert.fail(error);
  }
}

export async function configAttributes(page, frame, product) {
  try {
    const pageTitle = await nav.getInnerText(frame, properties.get('cpq.config.products.heading'));
    console.log(pageTitle);
    if (pageTitle === 'Configure Products') {
      await nav.fillForm(frame, product);
      switch (product.productName){
        case 'Silver Agent Subscription':
        case 'Gold Agent Subscription':
          await frame.waitFor(constantValues.TIMEOUT_2_SEC);
          await addOnProducts(frame, product.addOnProducts);
          break;
        case 'Customized Email Marketing (CEM)':
          await frame.select('.myselect.style-scope.sb-select.--desktop', 'Property Price', 'Annual Income', 'Gender');
          break;
        case 'Segmented eDM':
          await frame.select('.myselect.style-scope.sb-select.--desktop', 'Location', 'Property Type', 'Age Group');
          break;
      }
    }
  } catch (error) {
    await nav.screenShot(page);
    console.log(error);
    assert.fail(error);
  }
}

export async function addOnProducts(frame, listOfAddons) {
  for (const index in listOfAddons) {
    const checkboxXpath = nav.replaceXpath(properties.get('cpq.searchProduct.checkbox'), listOfAddons[index]);
    await cpq.click(frame, checkboxXpath);
  }
}

export async function dateInput(frame){
  await cpq.calender(frame, 'Start Date', data.getDate(data.DateType.recent), 'Yes');
}

export async function inputTargetCustomerAmount(frame){
  await cpq.buttonClick(frame, properties.get('cpq.cpq.date'), 'Target Customer Amount');
}

export async function clickCalculateButton(frame){
  await cpq.buttonClick(frame, properties.get('cpq.cpq.button'), 'Calculate');
}

export async function changeQuantity(page, frame, productName, quantity) {
  try {
    const quoteLineTable = await this.quoteLineTable(page, frame, productName);
    const quantityClick = quoteLineTable + '//child::div[@field=\'SBQQ__Quantity__c\']//div';
    const quantityEnter = quoteLineTable + '//child::div[@field=\'SBQQ__Quantity__c\']//input';
    await cpq.doubelClick(frame, quantityClick);
    await cpq.enter(frame, quantityEnter, quantity);
    await frame.waitFor(constantValues.TIMEOUT_2_SEC);
    console.log('Edited Quantity successfully');
  } catch (error) {
    await nav.screenShot(page);
    console.log(error);
    assert.fail(error);
  }

}

export async function changeDiscount(page, frame, productName, discount, discountReason, currency, additionalDiscTextbox = false) {
  try {
    await page.waitFor(constantValues.TIMEOUT_HALF_SEC);
    if (additionalDiscTextbox){
      await cpq.enter(frame, properties.get('cpq.additionalDisc.textbox'), discount);
    } else {
      const quoteLineTable = await this.quoteLineTable(page, frame, productName);
      const discountClick = quoteLineTable + '//child::div[@field=\'SBQQ__AdditionalDiscount__c\']//div';
      const discountEnter = quoteLineTable + '//child::div[2]//input';
      await cpq.doubelClick(frame, discountClick);
      if (currency.length > 0){
        await page.waitFor(constantValues.TIMEOUT_1_SEC);
        const selectElem = await frame.$(properties.get('quote.additionDisc.dropdown'));
        await selectElem.type(currency);
      }
      await cpq.enter(frame, discountEnter, discount);
      await page.keyboard.press('Tab', {delay: 10});
    }
    await cpq.dropdown(frame, 'Discount Reason', discountReason);
    console.log('Edited Discount successfully');
  } catch (error) {
    await nav.screenShot(page);
    console.log(error);
    assert.fail(error);
  }

}


export async function quoteLineTable(page, frame, productName) {
  let count = 0;
  const elements = await frame.$$('.row.style-scope.sf-standard-table.x-scope.sf-le-table-row-0 > div>div >div:nth-of-type(4)>div');
  for (const element of elements) {
    const label = await frame.evaluate(el =>
      el.innerText, element);
    console.log(`Product = ${label}`);
    if (label.includes(productName)){
      break;
    } else {
      count = count + 1;
    }
  }
  return '//sf-le-table-row[@class=\'row style-scope sf-standard-table x-scope sf-le-table-row-0\'][@data-index=\'' + count + '\']';
}

export async function searchAgent(page, textValue){
  await cpq.enter(page, properties.get('cpq.cpq.agent.search'), textValue);
  await cpq.click(page,properties.get('cpq.cpq.agent.contacts'));
}

export async function quoteLineSave(page, frame) {
  try {
    await frame.waitForXPath(properties.get('cpq.spinner'), {hidden: false});
    await cpq.waitForSpinner(frame);
    await cpq.buttonClick(frame, properties.get('cpq.cpq.button'), 'Save');
    await cpq.waitForSpinner(frame);
    await page.waitFor(constantValues.TIMEOUT_2_SEC);
  } catch (error) {
    await nav.screenShot(page);
    console.log(error);
    assert.fail(error);
  }

}

export async function captureQuoteDetails(page) {

  const quoteDetailsMap = new hashMap();

  try {
    await page.waitFor(constantValues.TIMEOUT_2_SEC);
    const temp = await nav.getDetailsPageFieldValues(page, 'Start Date', properties.get('generic.details.fieldName'));
    if (!temp) {
      await page.waitForXPath(properties.get('quote.editproductline'), {timeout: constantValues.TIMEOUT_LONG_SEC});
      await nav.reload(page);
      await page.waitForXPath(properties.get('quote.editproductline'), {timeout: constantValues.TIMEOUT_LONG_SEC});
    }
    await page.waitFor(constantValues.TIMEOUT_1_SEC);
    quoteDetailsMap.set('Net Amount', await nav.getDetailsPageFieldValues(page, 'Net Amount', properties.get('generic.details.fieldName')));
    quoteDetailsMap.set('Start Date', await nav.getDetailsPageFieldValues(page, 'Start Date', properties.get('generic.details.fieldName')));
    quoteDetailsMap.set('End Date', await nav.getDetailsPageFieldValues(page, 'End Date', properties.get('generic.details.fieldName')));
    quoteDetailsMap.set('Status', await nav.getDetailsPageFieldValues(page, 'Status', properties.get('generic.details.fieldName')));
    return quoteDetailsMap;
  } catch (error) {
    await nav.screenShot(page);
    console.log(error);
    assert.fail(error);
  }
}

export async function generateDocument(page) {
  try {
    await nav.click(page, 'Generate Document');
    const frame = await cpq.quoteDocumentVisible(page);
    await cpq.buttonClick(frame, properties.get('generateDocument.save.button'), 'Save');
    console.log('Document generated successfully and click on Save');
    await page.waitForXPath('//*[@title=\'View\']', {timeout: constantValues.TIMEOUT_LONG_SEC});
    console.log('Back to Quote');
  } catch (error) {
    await nav.screenShot(page);
    console.log(error);
    assert.fail(error);
  }
}

export async function editPaymentDetailsWithRetry(page, quoteNumber, quoteStatus, paymentType, entitledToCommission = true, retry = 0) {
  try {
    await editPaymentDetails(page, quoteNumber, quoteStatus, paymentType, entitledToCommission);
    try {
      const message = await nav.waitForVisualForceMessage(page);
      assert.include(message, 'was saved', 'edit was successful');
      console.log('Edited payment details successfully');
    } catch (error) {
      console.log('Reload message has been displayed');
      const errorMsg = await nav.getInnerText(page, properties.get('generic.error.list'));
      console.log(errorMsg);
      if (retry < constantValues.MAXRETRY && errorMsg.includes('then reload the record and enter your updates again')) {
        console.log('Entered if loop to click reload button');
        retry++;
        await nav.xpathClick(page, properties.get('quote.reload'));
        await editPaymentDetailsWithRetry(page, quoteNumber, quoteStatus, paymentType, entitledToCommission, retry);
      }
    }

  } catch (error) {
    await nav.screenShot(page);
    console.log(error);
    assert.fail(error);
  }

}

export async function editPaymentDetails(page, quoteNumber, quoteStatus, paymentType, entitledToCommission = true) {
  try {
    await nav.globalSearch(page, quoteNumber, 'Quotes');
    await page.reload();
    await page.waitFor(constantValues.TIMEOUT_2_SEC);
    await nav.click(page, 'Edit');
    await nav.dropdown(page, 'Payment Type', paymentType);
    await nav.textInput(page, 'Payment Date', data.getDate(data.DateType.recent));
    if (paymentType !== 'Cash') {
      await nav.textInput(page, 'Reference Number', faker.random.number({
        'min': 100000,
        'max': 999999
      }).toString());
    }
    await nav.textArea(page, 'Remarks', faker.random.word(3));
    if (entitledToCommission){
      await nav.checkBoxInput(page, 'Entitled to Agency Commission');
    }
    await nav.dropdown(page, 'Status', quoteStatus);
    await nav.footerbutton(page, 'Save');
  } catch (error) {
    await nav.screenShot(page);
    console.log(error);
    assert.fail(error);
  }
}

export async function relatedOrder(page ,click = false){
  await nav.relatedTab(page, 'Related');
  await nav.scrollDown(page);
  await page.waitFor(constantValues.TIMEOUT_2_SEC);
  const orderNumber = await nav.getInnerText(page, properties.get('createOrder.order.number'));
  if (click) {
    await nav.xpathClick(page, properties.get('createOrder.order.number'));
  }
  return orderNumber;
}

