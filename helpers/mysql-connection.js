'use strict';

var mysql= require("mysql");
var mysqlConfig = require("../config/mysql-config");

// create mysql connection pool using configuration
var pool= mysql.createPool(mysqlConfig.mysqlSetting);

module.exports.db = pool;