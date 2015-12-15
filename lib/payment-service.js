/* service context initiates the payment
 * process of requested gateway
 */
'use strict';
module.exports = {
  pay: function(payment, data, abstract, callback) {
    payment.pay(data, abstract, callback);
  }
};