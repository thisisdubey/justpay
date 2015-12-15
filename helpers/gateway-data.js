'use strict';

// create and return JSON for Paypal gateway
var paypalJson = function(price, currency, cardNumber, expDate, cvv, cardType, firstName, lastName) {
  // parse expiry date to year & month separately
  var sections = expDate.split('-');
  var year = parseInt(sections[0], 10);
  var month = parseInt(sections[1], 10);
  // create paypal gateway input data
  var create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "credit_card",
      "funding_instruments": [{
        "credit_card": {
          "number": cardNumber,
          "type": cardType,
          "expire_month": month,
          "expire_year": year,
          "cvv2": cvv,
          "first_name": firstName,
          "last_name": lastName,
          "billing_address":{
           "line1":"111 First Street",
           "city":"Saratoga",
           "state":"CA",
           "postal_code":"95070",
           "country_code":"US"
         }          
        }
      }]
    },
    "transactions": [{
      "amount": {
        "total": price,
        "currency": currency
      },
      "description": "This is the payment transaction description."
    }]
  };
  return create_payment_json;
};

// create and return JSON for Braintree gateway
var braintreeJson = function(price, cardNumber, expDate, cvv) {
  // parse expiry date to year & month
  var sections = expDate.split('-');
  var year = sections[0];
  // braintree accepts only last 2 digits of year [in mm/yy format]
  var lastTwoOfYear = ((parseInt(year, 10)) % 100) + '';
  var month = sections[1];
  // create braintree gateway input data
  var saleRequest = {
    amount: price,
    creditCard: {
      number: cardNumber,
      cvv: cvv,
      expirationDate: month + '/' + lastTwoOfYear
    },
    options: {
      submitForSettlement: true
    }
  };
  return saleRequest;
};

// exposes the specific data
module.exports = {
  paypalData: paypalJson,
  braintreeData: braintreeJson
}