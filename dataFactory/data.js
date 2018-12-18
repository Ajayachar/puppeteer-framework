// load faker from library
const faker = require('faker/locale/en_AU');
const moment = require('moment');

export const DateType = Object.freeze({'past': 1, 'future': 2, 'recent': 3});


export const businessAccount = country => ({
  accountType: 'Business',
  textInput: {
    'Account Name': faker.company.companyName(),
    'Phone': getPhoneNumber(),
    'Phone Extension': faker.random.number({ 'min': 1000, 'max': 9999 }).toString(),
    'Other Phone': getPhoneNumber(),
    'Website': faker.internet.url(),
    'Fax': getPhoneNumber(),
    'City/Suburb': faker.address.city(),
    'State/Province': faker.address.state(),
    'Zip/Postal Code': faker.address.zipCode(),
    'Country': country
  },
  textArea: {
    'Description': 'New accounts created Asia',
    'Street': faker.address.streetAddress()
  },
  dropdown: {
    'Status': 'New'
  }
});

export const soleTraderAccount = () => ({
  accountType: 'Sole Trader',
  textInput: {
    'Account Name': faker.company.companyName(),
  }
});

export const contact = country => ({
  textInput: {
    'First Name': faker.name.firstName(),
    'Last Name': faker.name.lastName(),
    'Preferred Name': faker.name.firstName(),
    'Department': faker.commerce.department(),
    'Title': faker.name.jobTitle(),
    'Mobile': getPhoneNumber(),
    'Phone': getPhoneNumber(),
    'Phone Extension': faker.random.number({ 'min': 1000, 'max': 9999 }).toString(),
    'Fax': getPhoneNumber(),
    'Malaysian ID Reference': faker.random.number({ 'min': 1000, 'max': 9999 }).toString(),
    'Primary IM Name': faker.name.findName(),
    'Profile URL': faker.internet.url(),
    'Birthday': '09/01',
    'City/Suburb': faker.address.city(),
    'State/Province': faker.address.state(),
    'Zip/Postal Code': faker.address.zipCode(),
    'Country': country
  },
  emailInput: {
    'Email': faker.internet.email()
  },
  textArea: {
    'Street': faker.address.streetAddress()
  },
  dropdown: {
    'Prefix': 'Mr',
    'Function': 'Human Resources',
    'Position Type': 'Executive',
    'Primary IM Type': 'WhatsApp'
  }

});

export const contactFromAccount = country => ({
  textInput: {
    'First Name': faker.name.firstName(),
    'Last Name': faker.name.lastName(),
    'Preferred Name': faker.name.firstName(),
    'Department': faker.commerce.department(),
    'Title': faker.name.jobTitle(),
    'Mobile': getPhoneNumber(),
    'Phone Extension': faker.random.number({ 'min': 1000, 'max': 9999 }).toString(),
    'Malaysian ID Reference': faker.random.number({ 'min': 1000, 'max': 9999 }).toString(),
    'Primary IM Name': faker.name.findName(),
    'Profile URL': faker.internet.url(),
    'Birthday': '09/01',
    'City/Suburb': faker.address.city(),
    'State/Province': faker.address.state(),
    'Zip/Postal Code': faker.address.zipCode(),
    'Country': country
  },
  emailInput: {
    'Email': faker.internet.email()
  },
  textArea: {
    'Street': faker.address.streetAddress()
  },
  dropdown: {
    'Prefix': 'Mr',
    'Function': 'Human Resources',
    'Position Type': 'Executive',
    'Primary IM Type': 'WhatsApp'
  }

});

export const opportunity = currency => ({
  textInput: {
    'Opportunity Name': faker.company.companyName(),
    'Amount': faker.finance.amount(),
    'Closed Reason Notes': 'Oppty is closed because of Expensive Price',
    'Proposed Start Date': getDate(DateType.recent),
    'Proposed End Date': getDate(DateType.future),
    'Close Date': getDate(DateType.future)
  },
  dropdown: {
    'Opportunity Currency': currency,
    'Type': 'New',
    'Stage': 'Qualified',
    'Priority': 'High',
    'Source': 'Account Management'
  }

});

export const b2bBillingInformation = (countryLicence,billingCountry) => ({
  textInput: {
    'Trading Name': faker.name.lastName(),
    'Business Registration Number': faker.random.number({ 'min': 1000000, 'max': 9999999}).toString(),
    'Billing Contact Email': faker.internet.email()
  },
  dropdown: {
    'Business Registration Type': 'Partnership',
    'Country of Licence': countryLicence,
    'Billing Country': billingCountry
  }
});

export const alternateBilling = billingCountry => ({
  textInput: {
    'Billing Contact Name': faker.name.firstName(),
    'Billing Contact Phone': getPhoneNumber(),
    'Billing Contact Email': faker.internet.email(),
    'Billing Street': faker.address.streetAddress(),
    'Billing City/ Suburb': faker.address.city(),
    'Billing State/ Province': faker.address.state(),
    'Billing Zip/ Postal Code': faker.address.zipCode()
  },
  dropdown: {

    'Billing Country': billingCountry

  }
});

/** *********************************************************************
 Function Name: getPhoneNumber()
 Description: This is a generic function to get phone number with +61 extension
 Date:
 Author:
 Modified:
 ************************************************************************/
export function getPhoneNumber() {

  let phonenumber = faker.phone.phoneNumber().replace(/\s+/g, '');
  if (phonenumber.includes('+61')){
    return phonenumber;
  } else if (phonenumber.substring(0,1).includes('0')){
    phonenumber = phonenumber.replace('0','');
    return '+61' + phonenumber;
  }
}

/** *********************************************************************
 Function Name: getDate()
 Description: This is a generic function to get past, future
 or recent date based on the type passed and also does the formating
 Date:
 Author:
 Modified:
 ************************************************************************/

export function getDate(type){
  let date;
  switch (type){
    case DateType.past: date = faker.date.past();break;
    case DateType.future: date = faker.date.future();break;
    case DateType.recent: date = faker.date.recent();break;
  }
  return moment(date).format('DD/MM/YYYY');

}
