
// declare constant variables
const puppeteer = require('puppeteer');
const nav = require('../library/genericfunctions');
const constantValues = require('./constants');

require('dotenv').config({ path: require('find-config')('.env') });

/** *********************************************************************
Function Name: loginToSalesforce()
Description: Login into salesforce by entering username and password
Date:
Author:
Modified:
************************************************************************/
export async function loginToSalesforce(browser,userNameKey, passwordKey){

  try {

    const userName = process.env[userNameKey];
    const password = process.env[passwordKey];


    // Create a new Page
    const page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080});
    page.setDefaultNavigationTimeout(constantValues.TIMEOUT_MEDIUM_SEC);
    await page.goto(process.env.SALESFORCE_URL);
    await page.type('#username', userName);
    await page.type('#password', password);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      page.evaluate(() => {
        document.querySelector('#Login').click();
      }),
    ]);
    console.log('Successfully logged into salesforce as ' + userName + '\n');
    return page;
  } catch (e){
    await nav.screenShot(page, 'Failed to login');
    console.log(e);
  }
}

/** *********************************************************************
Function Name: launchchrome()
Description: This function will luanch chrome broswer and return browser
Date:
Author:
Modified:
************************************************************************/
export async function launchchrome(){

  try {
    const browser = await puppeteer.launch(
        {headless: JSON.parse(process.env.HEADLESS), executablePath: process.env.CHROME_BIN || null,
          args: ['--disable-notifications', '--no-sandbox','--disable-gpu', '--disable-dev-shm-usage','--start-maximized', '--start-fullscreen']});
    return browser;
  } catch (e){
    console.log(e);
  }

}


