
/**
 * Module dependencies.
 * @private
 */

var request = require('request')

/**
 * Module exports.
 */

module.exports = processCommand

/**
 * Process Whim commands.
 *
 * @param {string} commandStr
 * @return {Promise}
 * @public
 */

function processCommand (commandStr) {
  var promise = new Promise(
    function (resolve, reject) {
      var commandObj = parseCommand(commandStr)
      var appUrl = getAppUrl(commandObj.app)

      if (appUrl) {
        request.get({
          url: appUrl,
          qs: {
            command: commandObj.parameters
          }
        }, function (error, response, body) {
          resolve(body.message)
        })
      } else {
        resolve("App " + commandObj.app + " not found.")
      }
    }
  )

  return promise;
}

/**
 * Parse Whim command
 *
 * @param {string} command
 * @return {object}
 * @private
 */

function parseCommand(command) {
  var matches = command.toLowerCase().match(/(\w+)\s*(.*)/)
  
  return {
    app: (matches.length > 1) ? matches[1] : null,
    parameters: (matches.length > 2) ? matches[2] : null,
  }
}

/**
 * Lookup app url.
 *
 * @param {string} name
 * @return {string}
 * @private
 */

function getAppUrl(name) {
  return {
    "mlb": "http://whim.mlb.livediagonal.com/execute"
  }[name]
}

