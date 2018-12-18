
// import object properties
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('properties/object.Properties');
const nav = require('../library/genericfunctions');
const moment = require('moment');


const constantValues = require('./constants');


export async function switchToIframe(page) {
  const dropDownContainer = await page.waitForXPath(properties.get('cpq.cpq.iFrame'));
  const frameName = await page.evaluate(dropDownContainer => dropDownContainer.getAttribute('name'), dropDownContainer);
  return await page.frames().find(frame => frame.name() === frameName);
}

export async function waitForSpinner(page) {
  try {
    await page.waitForXPath(properties.get('cpq.spinner'));
    await page.waitForXPath(properties.get('cpq.spinner'), { hidden: true });
  } catch (error){
    console.log('No Spinner displayed');
  }

}

export async function buttonClick(page, property, textValue) {
  const xpath = nav.replaceXpath(property, textValue);
  const element = await page.waitForXPath(xpath,{visible: true});
  await nav.clickFromPage(page,element);
  console.log('Clicked on ' + textValue + ' button successfully');
}

export async function doubelClick(page, property) {
  const element = await page.waitForXPath(property,{visible: true});
  await page.waitFor(2000);
  await nav.clickFromPage(page,element);
  await page.waitFor(1000);
  await nav.clickFromPage(page,element);
  console.log('Double clicked successfully');
}

export async function enter(page, property, textValue) {
  const element = await page.waitForXPath(property);
  await element.type(textValue);
}

export async function click(page, property) {
  const element = await page.waitForXPath(property,{timeout: constantValues.TIMEOUT_LONG_SEC});
  await nav.clickFromPage(page,element);
}

export async function enterDate(page, frame, property, fieldName, date) {
  const xpath = nav.replaceXpath(property, fieldName);
  const element = await frame.waitForXPath(xpath);
  frame.evaluate(el => el.value = '', element);
  await element.type(date);
  await page.keyboard('Enter');
}

export async function dropdown(page, fieldName, value) {
  let selector;
  switch (fieldName) {
    case 'Discount Reason': selector = properties.get('cpq.config.products.thirdcolumn.dropdown');break;
    case 'Product Release':
    case 'Contract Type':
    case 'Tier':
      selector = properties.get('cpq.config.products.firstcolumn.dropdown');break;
    case 'Subscription Type':
    case 'Customer Type':
      selector = properties.get('cpq.config.products.secondcolumn.dropdown');break;
    case 'Segments': selector = properties.get('cpq.config.products.segments.dropdown'); break;
    case 'AdditionalDiscCurrency': selector = properties.get('cpq.config.products.additionaldiscCurrency.dropdown'); break;
  }
  page.select(selector, value);
}

export async function priceBook(page){
  const frame = await switchToIframe(page);
  await waitForSpinner(frame);
  const isHidden = await frame.$eval(properties.get('cpq.choosePriceBookSave.popup'), el => el.hasAttribute('hidden'));
  if (!isHidden) {
    await nav.xpathClick(frame, properties.get('cpq.choosePriceBookSave.button'));
    await waitForSpinner(frame);
  }
  console.log('Edit product line completed');
  return frame;
}


export async function quoteDocumentVisible(page){
  const frame = await switchToIframe(page);
  await frame.waitForSelector(properties.get('generateDocument.loading.icon'), {timeout: constantValues.TIMEOUT_LONG_SEC});
  console.log('Waited for generate document loading icon');
  await frame.waitForSelector(properties.get('generateDocument.documentOptions.Container'), {timeout: constantValues.TIMEOUT_LONG_SEC});
  console.log('Waited for generate document container to load');
  return frame;
}

export async function calender(page, fieldName, dt, today = ''){

  const dtmoment = moment(dt, ['DD/MM/YYYY']);
  const newMonthName = dtmoment.format('MMMM');

  // get today's date
  const todaysdate = moment(new Date()).format('DD/MM/YYYY');
  await click(page, '//div[text()=\'' + fieldName + '\']//parent::div//span[@id=\'open\']');

  // if today date then click on t button to select today's date from date picker
  if (todaysdate === dt || today.length > 0) {
    // select today's date
    await click(page, '//div[text()=\'' + fieldName + '\']//parent::div//div[@id=\'today\']');
  } else {
    // select month name
    let appMonthName = await nav.getInnerText(page, '//div[text()=\'' + fieldName + '\']//parent::div//span[@id=\'monthName\']');
    console.log(appMonthName);
    while (appMonthName.toUpperCase() !== newMonthName.toUpperCase()) {
      await click(page, '//div[text()=\'' + fieldName + '\']//parent::div//span[@class=\'sb-icon-right-dir style-scope sb-datepicker\']');
      appMonthName = await nav.getInnerText(page, '//div[text()=\'' + fieldName + '\']//parent::div//span[@id=\'monthName\']');
    }
    // select Year
    if (fieldName === 'Start Date') {await page.select('#firstColumn > div .style-scope.sb-field > sb-datepicker select', dtmoment.format('YYYY'));} else if (fieldName === 'Expires On') {await page.select('#secondColumn > div .style-scope.sb-field > sb-datepicker select', dtmoment.format('YYYY'));}

    // select date
    const finaldate = await page.waitForXPath('//div[text()=\'' + fieldName + '\']//parent::div//div[@class=\'td  style-scope sb-datepicker\'] [text()=\'' +  dtmoment.format('D') + '\']');
    await nav.clickFromPage(page, finaldate);
  }

}

