const jsforce = require('jsforce');
require('dotenv').config({ path: require('find-config')('.env') });

export async function  salesForceAPILogin(userNameKey, passwordKey){

  const userName = process.env[userNameKey];
  const password = process.env[passwordKey];

  const conn = new jsforce.Connection({
    loginUrl: 'https://test.salesforce.com/services/Soap/u/42.0'
  });
  await conn.login(userName, password);
  return conn;
}


export async function salesForceAPILogout(sessionDetails){

  const conn = new jsforce.Connection({
    sessionId: sessionDetails.accessToken,
    serverUrl: sessionDetails.instanceUrl
  });
  await conn.logout(function(err) {
    if (err) { return console.error(err); }
  });
}

export async function querySalesForceID(conn, object, name){

  let query;
  if (name.includes('\'')){
    name = name.replace('\'','\\\'');
  }
  switch (object){
    case 'account': query = 'select id from Account where name=\'' + name + '\''; break;
    case 'contact': query = 'select id from contact where name=\'' + name + '\''; break;
    case 'opportunity': query = 'select id from opportunity where name=\'' + name + '\''; break;
    case 'order': query = 'select id from order where ordernumber =\'' + name + '\''; break;
    case 'billing': query = 'select id from legal_enity__c where name=\'' + name + '\''; break;
  }
  const result = await conn.query(query);
  console.log('query successful');
  return result.records[0].Id;
}
