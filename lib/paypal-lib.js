var paypal = require('paypal-rest-sdk');
var gatewayConfig = require('../config/gateway-config');

// exposes the method for paypal payment
module.exports = {
  pay: function(data, abstract, callback) {
    'use strict';
    // paypal rest sdk specific
    paypal.payment.create(data, gatewayConfig.paypal, function(err, res) {
      if (err) {
        return callback(err, null);
      }
      if (res) {
        if (abstract) {
          // create abstract response data
          var responseData = {
            'id': res.id,
            'status': res.state,
            'type': res.intent,
            'created_time': res.create_time,
            'updated_time': res.update_time
          };
          return callback(null, responseData);
        }
        return callback(null, res);
      }
    });
  }
};