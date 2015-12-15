var braintree = require('braintree');
var gatewayConfig = require('../config/gateway-config');

// Intialize the braintree gateway first [very important]
var gateway = braintree.connect({
  // Only environment variable here needs to be modified for production
  environment: braintree.Environment.Sandbox,
  merchantId: gatewayConfig.braintree.merchantId,
  publicKey: gatewayConfig.braintree.publicKey,
  privateKey: gatewayConfig.braintree.privateKey
});

// exposes the method for braintree payment
module.exports = {
  pay: function(data, abstract, callback) {
    'use strict';
    // braintree sdk specific
    gateway.transaction.sale(data, function(err, res) {
      if (err) {
        return callback(err, null);
      }
      if (res) {
        /* braintree does not respond with error data
         * if credit card test no [test card only] is not supported
         * hence need to be handled explicitly
         */
        if(res.errors) {
          return callback(res.message, null);
        }
        if (abstract) {
          // create abstract response data
          var responseData = {
            'id' : res.transaction.id,
            'status' : res.transaction.status,
            'type' : res.transaction.type,
            'created_time' : res.transaction.createdAt,
            'updated_time' : res.transaction.updatedAt
             };
             return callback(null, responseData);
        }
        return callback(null, res);
      }
    });
  }
}