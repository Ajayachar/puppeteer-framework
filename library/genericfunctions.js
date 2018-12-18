const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('properties/object.Properties');

const cpq = require('../library/cpqFunctions');
const chai = require('chai');
const assert = chai.assert;
const fs = require('fs');

const constantValues = require('./constants');

/** *********************************************************************
 Function Name: click()
 Description: This is a generic function, which will click on tabtile which you have passed
 Date:
 Author:
 Modified:
 ************************************************************************/
export async function click(page, tabTitle) {
  const xpath_selector = '//*[@title=\'' + tabTitle + '\']';
  await xpathClick(page, xpath_selector);
  console.log('Clicked on ' + tabTitle + ' button successfully');
}

export async function xpathClick(page, xpath) {
  await page.waitForXPath(xpath, {timeout: constantValues.TIMEOUT_MEDIUM_SEC});
  await page.evaluate(xpath => {
    const xpathresult = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const element = xpathresult.snapshotItem(0);
    element.click();
  }, xpath);
}

/** *********************************************************************
 Function Name: selectRecordType()
 Description: This is a generic function, which will click on radio button
 Date:
 Author:
 Modified:
 ************************************************************************/
export async function selectRecordType(page, rectype) {
  // select the recordtype
  await page.waitForSelector('.modal-container');
  const elements = await page.$$('.changeRecordTypeOptionRightColumn');

  for (const element of elements) {
    await page.evaluate((el, rectype) => {
      if (el.innerText.includes(rectype)) {
        el.click();
      }
    }, element, rectype);
  }
}

/** *********************************************************************
 Function Name: footerbutton()
 Description: This is a generic function to click on any button which is on the footer
 Date:
 Author:
 Modified:
 ************************************************************************/
export async function footerbutton(page, buttonname) {
  // Click Next on the RecordType
  const button = '//div[@class="modal-footer slds-modal__footer"]//span[text()=\'' + buttonname + '\']/parent::button';
  await xpathClick(page, button);
  console.log('Clicked on ' + buttonname + ' footer button successfully');
}

/** *********************************************************************
 Function Name: textInput()
 Description: Generic function to enter value in testbox
 Date:
 Author:
 Modified:
 ************************************************************************/
export async function textInput(page, label, value) {
  // console.log(' Filling input for '+ label + ' with value '+ value);
  const input = '//span[(text()=\'' + label + '\')]//parent::label/following::input[1]';
  const labelinput = await page.waitForXPath(input);
  await labelinput.type(value);
}

/** *********************************************************************
 Function Name: checkBoxInput()
 Description: Generic function to check a checkbox
 Date:
 Author:
 Modified:
 ************************************************************************/
export async function checkBoxInput(page, label) {
  // console.log(' Filling input for '+ label + ' with value '+ value);
  const input = '//span[(text()=\'' + label + '\')]//parent::label/following::input[1]';
  const labelinput = await page.waitForXPath(input);
  await clickFromPage(page, labelinput);
}

/** *********************************************************************
 Function Name: fillForm()
 Description: Generic function to fill data based on the faker data
 Date:
 Author:
 Modified:
 ************************************************************************/
export async function fillForm(page, record) {
  for (const key in record) {
    await page.waitFor(500);
    const func = this[key];
    if (func !== undefined && (func instanceof Function)) {
      await processRecords(page, record[key], this[key]);
    } else {
      //      console.log(`${key} is not available function`);
    }

  }
}

export async function processRecords(page, record, func) {
  for (const key in record) {
    await func(page, key, record[key]);
  }

}

export async function textArea(page, label, value) {
  // console.log(' Filling text area for '+ label + ' with value '+ value);
  const textArea = '//span[text()=\'' + label + '\']/parent::label/following-sibling::textarea';
  const labelarea = await page.waitForXPath(textArea);
  await labelarea.type(value);
}

export async function emailInput(page, label, value) {
  const email = '//span[text()=\'' + label + '\']/parent::label/parent::div/input';
  const inputE = await page.waitForXPath(email);
  await inputE.type(value);

}

export async function dropdown(page, fieldname, value) {

  const pick = '//div[@class="slds-form-element__control"]//child::span[text()=\'' + fieldname + '\']//following::div[2]//descendant::a';
  const picklist = await page.waitForXPath(pick);
  await clickFromPage(page, picklist);

  const dropDownContainerXpath = '//div[@class="slds-form-element__control"]//child::span[text()=\'' + fieldname + '\']//following::div[2]//descendant::a//parent::div/parent::div/parent::div';
  const dropDownContainer = await page.waitForXPath(dropDownContainerXpath);
  const iDAttributeValue = await page.evaluate(dropDownContainer => dropDownContainer.getAttribute('id'), dropDownContainer);

  await page.evaluate((xpath, listValue) => {
    const iterator = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);

    try {
      let thisNode = iterator.iterateNext();

      while (thisNode) {
        // console.log( thisNode.textContent );
        if (thisNode.textContent === listValue) {
          thisNode.click();
          break;
        }
        thisNode = iterator.iterateNext();
      }
    } catch (e) {
      alert('Error: Document tree modified during iteration ' + e);
    }
  }, '//div[@aria-labelledby=\'' + iDAttributeValue + '\']//ul[@class=\'scrollable\']//li/a', value);

}

export async function relatedTab(page, relate) {
  // Click  on the RelatedTab
  const relatebutton = '//div[contains(@class,"active lafPageHost")]//following-sibling::div//descendant::li/a/span[text()=\'' + relate + '\']';
  await page.waitForXPath(relatebutton);
  await xpathClick(page, relatebutton);
}

export async function relatedNewContact(page, newcont) {
  // Click on NewContact in the RelatedTab
  const newcontact = '//div[@class="slds-card__header slds-grid"]//following::div[3]/ul/li/a/div[text()=\'' + newcont + '\']';
  await xpathClick(page, newcontact);

}

export async function relatedNewButton(page, labelname) {
  // Click on New button in the RelatedTab
  const newbutton = '//span[@title=\'' + labelname + '\']//following::div[2]/ul/li/a[@title=\'New\']';
  await xpathClick(page, newbutton);
}

export async function search(page, label, value) {
  // Input lookup and select the values
  const input = '//span[(text()=\'' + label + '\')]//parent::label/following::input[1]';
  const labelinput = await page.waitForXPath(input);
  await labelinput.type(value, {delay: 100});
  await page.waitFor(constantValues.TIMEOUT_2_SEC);
  const elements = await page.$$('div.uiInput--lookup > div.listContent > ul.lookup__list.visible >li > a > div:nth-of-type(2) > div:nth-of-type(1)');
  for (const element of elements) {
    const title = await page.evaluate(el =>
      el.getAttribute('title'), element);
    if (title === value) {
      await clickFromPage(page, element);
      break;
    }
  }

}

export async function waitForVisualForceMessage(page) {

  const elements = await page.waitForXPath(properties.get('generic.visualForceToastMessage.text'));
  const message = await page.evaluate(el => el.innerText, elements);
  await page.waitFor(2000);
  await xpathClick(page, properties.get('generic.visualForceToastMessage.close.button'));
  // code to wait until toast message disappears
  // await page.waitForFunction(() => !document.querySelector('.toastMessage.slds-text-heading--small.forceActionsText'), {polling: 'mutation'});
  return message;
}

export async function globalSearch(page, searchValue, searchType) {
  // Code to select filter type
  let count = 0;
  while (count < constantValues.MINRETRY) {

    await globalSearchTypeFilter(page, searchType);
    // construction the xpath of search textbox
    const searchXpath = 'Search ' + searchType;
    // code to enter the search value in textbox and select
    await globalSearchValue(page, searchXpath, searchValue);

    const updatedSearchType = searchType === 'Opportunities' ? 'Opportunity' : searchType;
    // capture heading and compare if that match with searchtype
    if (await captureHeading(page, updatedSearchType)) {
      console.log(`Search: ${searchValue} Successful`);
      break;
    } else {
      await reload(page);
      await page.waitFor(constantValues.TIMEOUT_2_SEC);
      if (await captureHeading(page, updatedSearchType)) {
        console.log(`Search: ${searchValue} Successful`);
        break;
      }
    }
    count++;
  }
  if (count === constantValues.MINRETRY) {
    console.log(`Intital Global Search: ${searchValue} failed`);
    await globalSearchResultsClick(page, searchValue, searchType);
  }
}

export async function captureHeading(page, searchType) {
  try {
    const heading = await getInnerText(page, properties.get('generic.header.label'));
    if (searchType.includes(heading)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }


}

export async function globalSearchTypeFilter(page, searchType) {
  await xpathClick(page, properties.get('generic.globalSearch.filter'));
  await page.waitForSelector(properties.get('generic.globalSearch.filterType'));
  const elements = await page.$$(properties.get('generic.globalSearch.filterType'));
  for (const ele of elements) {
    const title = await page.evaluate(el =>
      el.getAttribute('title'), ele);
    if (title === searchType) {
      await clickFromPage(page, ele);
      break;
    }
  }
  console.log('Filter type ' + searchType + ' selected successfully');
}

export async function globalSearchValue(page, searchXpath, searchValue) {
  try {
    await globalEnterValue(page, searchXpath, searchValue);
  } catch (error) {
    await globalEnterValue(page, searchXpath, searchValue);
  }

  const searchElements = await page.$$(properties.get('generic.globalSearch.select'));
  for (const element of searchElements) {
    const searchTitle = await page.evaluate(el => el.getAttribute('title'), element);
    if (searchTitle === searchValue) {
      await clickFromPage(page, element);
      await page.waitFor(constantValues.TIMEOUT_2_SEC);
    }
  }
  console.log('Entered search value ' + searchValue + ' and clicked on it');
}

export async function globalEnterValue(page, searchXpath, searchValue) {
  const searchTestBox = await page.waitForXPath('//input[@title=\'' + searchXpath + '\']');
  await page.evaluate(el => el.value = '', searchTestBox);
  await searchTestBox.type(searchValue, {delay: 100});
  await page.waitForSelector('.lookup__list.visible');
  console.log(searchValue + ' entered in text box');

}

export async function globalSearchResultsClick(page, searchValue, searchType, retryCounter = 0) {
  try {
    await globalSearchTypeFilter(page, searchType);
    const searchXpath = 'Search ' + searchType;     // construction the xpath of search textbox
    const searchTestBox = await page.waitForXPath('//input[@title=\'' + searchXpath + '\']');
    await page.evaluate(el => el.value = '', searchTestBox);
    await searchTestBox.type(searchValue);
    await page.keyboard.press('Enter');
    await page.waitForSelector('.scroller.actionBarPlugin');
    const xpath = await page.waitForXPath('//table[@data-aura-class=\'uiVirtualDataTable\']//a[@title=\'' + searchValue + '\']');
    await page.evaluate(el => el.click(), xpath);
  } catch (error) {
    if (retryCounter < constantValues.MAXRETRY) {
      retryCounter++;
      console.log('Retrying globalSearchResultsClick ' + retryCounter);
      await page.waitFor(constantValues.TIMEOUT_2_SEC);
      await globalSearchResultsClick(page, searchValue, searchType, retryCounter);
    } else {
      console.log(error);
      assert.fail(`Search: ${searchValue} failed`);
    }
  }

}

export async function getInnerText(page, xpath) {
  const headerContainer = await page.waitForXPath(xpath, {hidden: false});
  return await page.evaluate(headerContainer => headerContainer.innerText, headerContainer);

}

export async function lookUpLink(page, labelname, value) {
  const lookup = '//span[text()=\'' + labelname + '\']//parent::div[contains(@class,\'test-id__field-label-container\')]//following-sibling::div//a[text()=\'' + value + '\']';
  await xpathClick(page, lookup);

}

export async function screenShot(page, filename = '') {

  const dir = './screenShots';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  if (filename.length > 0) {
    await page.screenshot({
      path: 'screenShots/errorScreenShot-' + filename + '-' + Date() + '.png',
      fullPage: true
    });
  } else {
    await page.screenshot({path: 'screenShots/errorScreenShot-' + Date() + '.png', fullPage: true});

  }


}

export async function modalButton(page) {
  await xpathClick(page, properties.get('generic.model.close.button'));
}

export async function reload(page) {
  await page.reload();
  // waiting until dom content is loaded
  await page.waitForNavigation({timeout: constantValues.TIMEOUT_MEDIUM_SEC, waitUntil: 'domcontentloaded'});
}

export async function isVisible(page, selector) {
  await page.waitFor(constantValues.TIMEOUT_2_SEC);
  return await page.$$eval(selector, e1 => e1.length > 0);

}

export async function getDetailsPageFieldValues(page, fieldName, property) {
  const xpath = replaceXpath(property, fieldName);
  return getInnerText(page, xpath);
}

export async function switchToNewPage(browser) {
  const pages = await browser.pages();
  return pages[1];

}

export async function switchToMainPage(browser) {
  const pages = await browser.pages();
  return pages[0];
}

export function replaceXpath(elementProperty, valueToBeReplaced) {
  return elementProperty.replace('propertyToBeReplaced', valueToBeReplaced);
}

export async function scrollDown(page) {
  page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });

}

export async function clickFromPage(page, element) {
  await page.evaluate(el => el.click(), element);
}

export function formatAmount(amount) {
  let formatAmount;
  if (amount.includes('(')) {
    formatAmount = amount.split('(');
    return formatAmount[0].trim();
  } else {
    formatAmount = amount;
    return formatAmount.trim();
  }

}

export async function selectDropdown(page, fieldName, value) {
  await cpq.dropdown(page, fieldName, value);
}


