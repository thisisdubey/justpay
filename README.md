# justpay
   This application and library including, only support credit card data processing for braintree and paypal gateway

 gatway library is in lib folder, which can be used as follows:

 ```javascript
  var lib = require('../lib/index'); // to inject lib
  .......
  // some function to initiate
  ...........
  // type could be payment type either 'paypal' or 'braintree' string (currently only these 2 are supported)
  // data could be the request data created for respecive gateway (paypal or braintree accepted credit card data)
  // put abstract true only for getting the most desired data
    lib.payUsingGateway(type, data, abstract, function(error, result) {
      if (error) {
        condole.log(error);
      }
      if (result) {
        console.log(result);
      }
    });
 ```
  To run the application:
   first install the dependency using
  ```
  npm install
  ```
   it will install the dependent library mentioned in package.json
   then, to start the application
   ```
   npm start
   ```
   or,
   ```
   node app.js
   ```
   use only valid paypal or braintree acceptable credit card test no for testing.
     To test the application use :
   ```
   npm test
   ```
   test is written using mocha and chai
      
