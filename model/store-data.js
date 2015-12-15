'use strict';

var mysqlConnection = require('../helpers/mysql-connection.js');
var mysqlConfig = require("../config/mysql-config");

// exposes the method to insert data in database
module.exports = {
  /* method to insert data into database
   * @orderData payment order data from client
   * @result data from gateway library
   * @callback callback function
   */
  insertToDb: function(orderData, result, callback) {
    // get mysql connection from pool
    mysqlConnection.db.getConnection(function(err, connection) {
      if (err) {
        return callback(err, null);
      } else {
        insertToOrder(connection, orderData, result, function(err, success) {
          if (err) {
            return callback(err, null);
          } else {
            return callback(null, success);
          }
        });
      }
    });
  }
};

// function to insert data in payment_order table
function insertToOrder(connection, orderData, result, callback) {
  // data for insertion
  var paymentOrder = {
    order_id: 0,
    payment_method: orderData.payment_method,
    first_name: orderData.first_name,
    last_name: orderData.last_name,
    amount_total: orderData.amount_total,
    currency: orderData.currency_selected,
    gateway: orderData.gateway_selected
  };
  connection.query(mysqlConfig.insertOrder, paymentOrder, function(err, rows) {
    if (err) {
      connection.release();
      return callback(err, null);
    } else {
      // last insert id [mandatory for next function]
      var lastId = rows.insertId;
      insertToResponse(connection, result, lastId, callback);
    }
  });
}

// function to insert data in payment_response table
function insertToResponse(connection, result, lastId, callback) {
  // data for insertion
  var paymentResponse = {
    response_id: 0,
    transaction_id: result.id,
    status: result.status,
    type: result.type,
    create_time: result.created_time,
    update_time: result.updated_time,
    order_id: lastId
  };
  connection.query(mysqlConfig.insertResponse, paymentResponse, function(err, rows) {
    if (err) {
      connection.release();
      return callback(err, null);
    } else {
      connection.release();
      return callback(null, rows);
    }
  });
}