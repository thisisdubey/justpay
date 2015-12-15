var config = {};
//mysql connection setup configuration for creating connection pool
config.mysqlSetting = {
  connectionLimit: 100,
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'just_pay_demo',
  debug: false
};

// insert query for order data, after payment is processed by gatway
config.insertOrder = 'INSERT INTO payment_order SET ?';
// insert query for payment response data, after payment is processed by gatway
config.insertResponse = 'INSERT INTO payment_response SET ?';

module.exports = config;