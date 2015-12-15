'use strict';

var expect = require("chai").expect;
var mysqlConnection = require('../helpers/mysql-connection');
var storeData = require('../model/store-data');

// test for mysql database
describe("mysql", function() {
  // test if mysql database can be connected
  describe("database connection", function() {
    it("should be working", function(done) {
      mysqlConnection.db.getConnection(function(err, connection) {
        expect(err).to.be.null;
        expect(connection).to.exist;
        connection.destroy();
        done();
      });
    });
  });
  
  // test if application insertion queries works 
  describe("database insert queries", function() {
    it("should be working", function(done) {
      // timeout is server system and network specific
      this.timeout(10000);
      // dummy data for payment order
      var orderData = {
        'payment_method': 'credit_card',
        'first_name': 'test',
        'last_name': 'data',
        'amount_total': '00.00',
        'currency_selected': 'USD',
        'gateway_selected': 'dummy'
      };
      // dummy data for payment response
      var resultData = {
        'id': 'dummy007',
        'status': 'approved',
        'type': 'sale',
        'created_time': '2015-12-14T15:07:24Z',
        'updated_time': '2015-12-14T15:07:24Z'
      };
      storeData.insertToDb(orderData, resultData, function(err, rows) {
        expect(err).to.be.null;
        expect(rows).to.exist;
        done();
      });
    });
  });
});