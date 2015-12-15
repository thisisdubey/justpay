// THESE MAY NOT WORK ALWAYS, AS GATEWAYS KEEP CHANGING THEIR CREDIT CARD NO. ACCEPTANCE DATA

// paypal request dummy data for gateway lib test
var paypalData = {
  "intent": "sale",
  "payer": {
    "payment_method": "credit_card",
    "funding_instruments": [{
      "credit_card": {
        "number": "371449635398431",
        "type": "amex",
        "expire_month": 12,
        "expire_year": 2018,
        "cvv2": "123",
        "first_name": "Betsy",
        "last_name": "Buyer",
        "billing_address": {
          "line1": "111 First Street",
          "city": "Saratoga",
          "state": "CA",
          "postal_code": "95070",
          "country_code": "US"
        }
      }
    }]
  },
  "transactions": [{
    "amount": {
      "total": "7.47",
      "currency": "USD"
    },
    "description": "This is the payment transaction description."
  }]
};

// braintree request dummy data for gateway lib test
var braintreeData = {
  amount: '10.00',
  creditCard: {
    number: '5555555555554444',
    cvv: '789',
    expirationDate: '11' + '/' + '21'
  },
  options: {
    submitForSettlement: true
  }
};

module.exports = {
  paypalData: paypalData,
  braintreeData: braintreeData
}