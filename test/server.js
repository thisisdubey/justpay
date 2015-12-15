'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');

chai.use(chaiHttp);
var expect = chai.expect;

// appplication server url to be used in test
var url = 'http://localhost:7000';

// test card numbers only for gateway processing (last 2 test)
var gatewayTestCardAmEx = '371449635398431';
var gatewayTestCardMaster = '5555555555554444';

// test for all basic application features
describe("Application server", function() {
  // test if home page is working (server is running)
  describe("home page", function() {
    it("returns status 200", function(done) {
      chai.request(url)
        .get('/')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        })

    });
  });
  // test all payment related features, from validation to response
  describe("payment page", function() {
    // test for only difficult (expiry date) incorrect input
    it("does not accept the incorrect input (expiry date) ", function(done) {
      chai.request(url)
        .post('/payment')
        .send({
          'price': '10.00',
          'currency': 'hkd',
          'fullName': 'Betsy Buyer',
          'nameCard': 'Betsy Buyer',
          'cardNumber': '5555555555554444',
          'expDate': '2015-11',
          'secure': '123'
        })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          done();
        });

    });
    // test for unsupported credit card types
    it("does not accept the cards other than (amex, visa, mastercard)", function(done) {
      chai.request(url)
        .post('/payment')
        .send({
          'price': '10.00',
          'currency': 'hkd',
          'fullName': 'Betsy Buyer',
          'nameCard': 'Betsy Buyer',
          'cardNumber': '371449635398431',
          'expDate': '2018-11',
          'secure': '123'
        })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          done();
        });

    });
    // test for {amex : usd} relation mapping
    it("does not accept AmEx card without currency USD", function(done) {
      chai.request(url)
        .post('/payment')
        .send({
          'price': '10.00',
          'currency': 'eur',
          'fullName': 'Betsy Buyer',
          'nameCard': 'Betsy Buyer',
          'cardNumber': '371449635398431',
          'expDate': '2018-11',
          'secure': '123'
        })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          done();
        });

    });
    // test if paypal gateway is able to process the payment 
    it("process payment using paypal", function(done) {
      // timeout is server system and network specific
      this.timeout(30000);
      chai.request(url)
        .post('/payment')
        .send({
          'price': '10.00',
          'currency': 'usd',
          'fullName': 'Betsy Buyer',
          'nameCard': 'Betsy Buyer',
          'cardNumber': gatewayTestCardAmEx,
          'expDate': '2018-11',
          'secure': '123'
        })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });

    });
    // test if braintree gateway is able to process the payment
    it("process payment using braintree", function(done) {
      // timeout is server system and network specific
      this.timeout(20000);
      chai.request(url)
        .post('/payment')
        .send({
          'price': '10.00',
          'currency': 'hkd',
          'fullName': 'Betsy Buyer',
          'nameCard': 'Betsy Buyer',
          'cardNumber': gatewayTestCardMaster,
          'expDate': '2018-11',
          'secure': '123'
        })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});