var paymentService = require('./payment-service');
var paypalLib = require('./paypal-lib');
var braintreeLib = require('./braintree-lib');

// method to provide gateway reference based on requested type
var getPaymentMethod = function(type) {
  'use strict';
  var payment = {
    'braintree': function() {
      return braintreeLib;
    },
    'paypal': function() {
      return paypalLib;
    },
    'default': function() {
      return 'default';
    }
  };
  return (payment[type] || payment['default'])();
}

module.exports = {
  /* method exposed for making the payment
   * @paymentType payment gateway type to be considered
   * @data credit card data for processing
   * @abstract if abstract response is to be sent
   * @config configuration setup for relevant gateway
   */
  payUsingGateway: function(paymentType, data, abstract, callback) {
    'use strict';
    var type = getPaymentMethod(paymentType);
    if (type === 'default') {
      return callback(new Error('Error- requested payment gateway is not supported'), null);
    } else {
      // service to invoke the appropriate gateway function
      paymentService.pay(type, data, abstract, function(err, response) {
        if (err) {
          console.log('Error from gateway library: ' + err);
          return callback(err, null);
        }
        if (response) {
          return callback(null, response);
        }
      });
    }
  }
};