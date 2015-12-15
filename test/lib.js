'use strict';

var expect = require("chai").expect;
var gatewayTestData = require('../helpers/gateway-test-data');
var gatewayLib = require('../lib/index');

// test for abstract response, similar to application
var ifAbstractResponse = true;

// test for gateway library functionality
describe("payment library", function() {

  // test for paypal gateway
  describe("paypal", function() {
    it("should process request", function(done) {
      // timeout is server system and network specific
      this.timeout(25000);
      gatewayLib.payUsingGateway('paypal', gatewayTestData.paypalData,
        ifAbstractResponse, function(error, result) {
          expect(error).to.be.null;
          expect(result).to.exist;
          done();
        });
    });
  });

  // test for braintree gateway
  describe("braintree", function() {
    it("should procces request", function(done) {
      // timeout is server system and network specific
      this.timeout(15000);
      gatewayLib.payUsingGateway('braintree', gatewayTestData.braintreeData,
        ifAbstractResponse, function(error, result) {
          expect(error).to.be.null;
          expect(result).to.exist;
          done();
        });
    });
  });
});