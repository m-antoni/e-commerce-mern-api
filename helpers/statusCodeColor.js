const colors = require('colors');

const statusCodeColor = function (statusCode) {

    let statusWithColor;

    // modified the 304 status code
    if(statusCode === 304){
      statusCode = 200;
    }

    switch (statusCode) {
      case 200:
      case 201:
        statusWithColor = '✅ ' + statusCode.toString().green
        break;
      case 400:
      case 401:
        statusWithColor = '⚠️ ' + statusCode.toString().yellow  
        break;
      case 500:
        statusWithColor = '❌ ' + statusCode.toString().red  
        break;
      default:
        statusWithColor = statusCode;
        break;
    }

    return statusWithColor;
}


module.exports = statusCodeColor;