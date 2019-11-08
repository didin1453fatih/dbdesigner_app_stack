/**
 * How to config SSL
 * https://stackoverflow.com/questions/2355568/create-a-openssl-certificate-on-windows
 *
 */
module.exports = {
  port: process.env.APP_PORT,
  url: process.env.APP_URL,
  secure: {
    status: process.env.SECURE_STATUS,
    properties: {
      key: process.env.SECURE_PROPERTIES_KEY,
      cert: process.env.SECURE_PROPERTIES_CERT
    }
  }
};
