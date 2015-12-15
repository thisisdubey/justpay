'use strict';

var express = require('express');
var fs = require('fs');
var gatewayLib = require('../lib/index');
var tool = require('../helpers/tools');
var gatewayConfig = require('../config/gateway-config');
var gatewayData = require('../helpers/gateway-data');
var storeData = require('../model/store-data');

// setup router
var router = express.Router();
/* locate the gateway rules file
 * file contains mapping logic of gateway, curreny and credit card
 */
var gatewayRulesFile = './helpers/gateway-rules.json';
// declare the payment method for processing [informational purpose only]
var paymentMethod = 'credit_card';

/* set option: if only abstract response data file
 * required from payment gatway, otherwise gateway will
 * return complete response file which will need to be handled 
 * using custom handlers. currently only abstract handler  
 * is present in this application.
 */
var ifAbstractResponse = true;

// process POST request at /payment 
router.post('/payment', function(req, res) {
  // changing all of them to string by default
  var price = req.body.price + '';
  // currency shall be changed to uppercase (for ex. USD)
  var currency = (req.body.currency + '').toUpperCase();
  var fullName = req.body.fullName + '';
  var nameOnCard = req.body.nameCard + '';
  var cardNumber = req.body.cardNumber + '';
  var expDate = req.body.expDate + '';
  var cvv = req.body.secure + '';

  // dataset contain request data with their validation result
  var inputDataset = {
    'Price': tool.validPrice(price),
    'Currency': tool.validCurrency(currency),
    'Full Name': tool.validName(fullName),
    'Name on card': tool.validName(nameOnCard),
    'Credit Card number': tool.validCreditCard(cardNumber),
    'Card expiry date': tool.validExpiryDate(expDate),
    'Card CVV': tool.validCvv(cvv)
  };

  // validat request before processing the payment
  validateRequest(inputDataset, function(error, fine) {
    if (error) {
      res.status(400);
      return res.render('error', {
        error: error
      });
    } else {
      // get type of payment gateway to be used	
      getPaymentGateway(currency, cardNumber, function(error, type) {
        if (error) {
          res.status(400);
          return res.render('error', {
            error: error
          });
        } else {
          var paymentType = type;
          // get the gateway specific payment data
          var paymentData = getPaymentData(paymentType, price, currency, fullName, nameOnCard, 
          	cardNumber, expDate, cvv);
          // use the gateway library to process the payment data
          gatewayLib.payUsingGateway(paymentType, paymentData, ifAbstractResponse, function(error, result) {
            if (error) {
              res.status(500);
              return res.render('error', {
                error: error
              });
            }
            if (result) {
              // if abstract response, store in database
              if (ifAbstractResponse) {
                var nameParts = fullName.split(' ');
                var firstName = nameParts[0];
                var lastName = nameParts[nameParts.length - 1];
                // create payment order data for database insertion
                var orderData = {
                  payment_method: paymentMethod,
                  first_name: firstName,
                  last_name: lastName,
                  amount_total: price,
                  currency_selected: currency,
                  gateway_selected: paymentType
                };
                storeData.insertToDb(orderData, result, function(error, rows) {
                  if (error) {
                    res.status(500);
                    return res.render('error', {
                      error: 'System error after transaction was completed, ' +
                        'please contact your bank.'
                    });
                  } else {
                    res.status(200);
                    return res.render('success', {
                      message: "Your transaction is processed."
                    });
                  }
                });
              } else {
                res.status(200);
                return res.render('success', {
                  message: "Your transaction is processed."
                });
              }
            }
          });
        }
      });
    }
  });

});

// function to validate request parameters
var validateRequest = function(data, callback) {
  for (var index in data) {
    if (!data[index]) {
      return callback(new Error('Invalid ' + index + '. Please correct'), null);
    }
  }
  return callback(null, 'fine');
}

/* function to provide appropriate gateway
 * if card is amex and currency is USD, use paypal
 * use paypal, if currency belongs to a subset of currency
 * THIS LOGIC IS IMPLEMENTED USING JSON, 
 * FOR COMPLEX LOGIC: IT'S BETTER TO USE DATABASE
 */
var getPaymentGateway = function(currency, cardNumber, callback) {
  var cardType = tool.getCreditCardType(cardNumber);
  if (cardType !== null) {
    fs.readFile(gatewayRulesFile, 'utf8', function(err, data) {
      if (err) {
        return callback(new Error('Error while implementing gateway rules'), null);
      } else {
        var obj = JSON.parse(data);
        var currencySelected = '';
        // logic for multiple card setting
        for (var index in obj.card.type) {
          // if requested card type is configured
          if (cardType.toUpperCase() === obj.card.type[index].name.toUpperCase()) {
            currencySelected = obj.card.type[index].currency.toUpperCase();
            // get the currency in [ card : currency ] mapping
            if (currency.toUpperCase() === currencySelected) {
              for (var index in obj.currency.type) {
                // get the gateway type in [ currency : gateway ] mapping
                if (currency.toUpperCase() === obj.currency.type[index].name.toUpperCase()) {
                  return callback(null, obj.currency.type[index].gateway);
                }
              }
            } else {
              return callback(new Error(cardType.toUpperCase() + ' card can be used ' +
                'only with currency ' + currencySelected), null);
            }
          }
        }
        // logic for multiple currency setting
        for (var index in obj.currency.type) {
          // if requested currency is configured
          if (currency.toUpperCase() === obj.currency.type[index].name.toUpperCase()) {
            return callback(null, obj.currency.type[index].gateway);
          }
        }
        return callback(new Error('Currency not supported'), null);
      }
    });
  } else {
    return callback(new Error('The credit card is not supported'), null);
  }
}

/* function to provide payment data for gateway to process,
 * converts the full name to first and last name,
 * return the data for respective payment gateway type
 */
function getPaymentData(paymentType, price, currency, fullName, nameOnCard, cardNumber, expDate, cvv) {
  var cardType = tool.getCreditCardType(cardNumber);
  var nameParts = nameOnCard.split(' ');
  var firstName = nameParts[0];
  var lastName = nameParts[nameParts.length - 1];
  if (paymentType === 'paypal') {
    return gatewayData.paypalData(price, currency, cardNumber, expDate, cvv, cardType, firstName, lastName);
  } else if (paymentType === 'braintree') {
    return gatewayData.braintreeData(price, cardNumber, expDate, cvv);
  }
}

module.exports = router;