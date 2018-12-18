
export async function logoutsalesforce(browser){

  await browser.disconnect();
  await browser.close();

}