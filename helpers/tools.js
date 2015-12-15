/* this file provides utility methods only
 * file name is not kept as util
 * since express has util named module 
 */
module.exports = {
  validName: function(name) {
    'use strict';
    // validating user name
    if (/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/.test(name)) {
      return true;
    }
    return false;
  },
  validPrice: function(value) {
    'use strict';
    // validating price value for 000.00
    if (/^((\d{1,3}(,\d{3})+)|(\d{1,3}))(\.(\d{2})?)$/.test(value)) {
      return true;
    }
    return false;
  },
  validCurrency: function(currency) {
    'use strict';
    // validating currency for USD, EUR, THB, HKD, SGD, AUD
    if (currency.match(/^(USD|EUR|THB|HKD|SGD|AUD)$/)) {
      return true;
    }
    return false;
  },
  validCreditCard: function(number) {
    'use strict';
    // validation for any credit card, 13 to 16 digits
    if (/[0-9]{13,16}/.test(number)) {
      return true;
    }
    return false;
  },
  getCreditCardType: function(number) {
    'use strict';
    // validate for card type: mastercard or visa or amex
    var result = '';
    if (/^(?:5[1-5][0-9]{14})$/.test(number)) {
      result = 'mastercard';
    } else if (/^(?:4[0-9]{12}(?:[0-9]{3})?)$/.test(number)) {
      result = 'visa';
    } else if (/^(?:3[47][0-9]{13})$/.test(number)) {
      result = 'amex';
    } else {
      result = null;
    }
    return result;
  },
  validCvv: function(number) {
    'use strict';
    // cvv validation for credit card
    if (/^[0-9]{3,4}$/.test(number)) {
      return true;
    }
    return false;
  },
  validExpiryDate: function(value) {
    'use strict';
    // validation for a valid credit card expiration date
    var sections = value.split('-');
    if (sections.length !== 2) {
      return false;
    }
    var year = parseInt(sections[0], 10);
    var month = parseInt(sections[1], 10);
    var currentMonth = new Date().getMonth() + 1;
    var currentYear = new Date().getFullYear();
    if (month <= 0 || month > 12 || year > currentYear + 10) {
      return false;
    }
    if (year < currentYear || (year == currentYear && month < currentMonth)) {
      // The date is expired
      return false;
    }
    return true;
  }
};