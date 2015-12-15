var config = {};
// configuration for paypal authentication
config.paypal = {
  "host": "api.sandbox.paypal.com",
  "port": "",
  "client_id": "AZYuyVDgm_lrK6jAdEdnhZzxAi2T3IN4ydQdDnyCcQm7NSlS80UwYu30eBrb_bHLID_U-BQIjcDi-SWs",
  "client_secret": "EE5d5PgNf4E_0y7EotCs_omousRS2jrjeOhKXWKo17D36VGmoQuhijEdrpo_j8SdjK2i9kcPyn0ZeOqz"
};

// configuration for braintree authentication
config.braintree = {};
/* environment: braintree.Environment.Sandbox, need to be placed directly 
* in braintree library js file, since braintree api does not accept it as string.
* To change the environment to production, modify the gateway variable in
* library file [braintree-lib.js] for braintree environment
*/
config.braintree.merchantId = "9p74jbfpcdt4rqxb";
config.braintree.publicKey = "w25qjy5mkmbkhp37";
config.braintree.privateKey = "a4b23d2fde3382475b377b822814677e";

module.exports = config;