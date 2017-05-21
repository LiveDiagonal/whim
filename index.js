require('dotenv').config()

var express = require('express')
var app = express()

var bodyParser = require('body-parser')
var request = require('request')
var twilio = require('twilio')
var MessagingResponse = twilio.twiml.MessagingResponse

app.set('port', (process.env.PORT || 5000))

app.use(express.static(__dirname + '/public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.get('/', function (request, response) {
  response.render("pages/index")
})

app.post('/command', function(request, response) {
  var processResult = function (result) {
    response.json(result);
  }

  processCommand(request.body.command, processResult);
})

app.post('/whim', function(req, res, next) {
  var twiml = new MessagingResponse();
  var processResult = function(result) {
    twiml.message(result.message);
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  }

  processCommand(req.body.Body, processResult);  
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
})

// Workspace


var processCommand = function (commandStr, processResult) {
  var commandObj = parseCommand(commandStr)
  var appUrl = getAppUrl(commandObj.app)

  if (appUrl) {
    request.get({
      url: appUrl,
      json: true,
      qs: {
        command: commandObj.parameters
      }
    }, function (error, response, body) {
      processResult(body);
    })
  } else {
    processResult({
      message: "Failure: app " + commandObj.app + " not found."
    })
  }
}


var getAppUrl = function(name) {
  return {
    "mlb": "http://whim.mlb.livediagonal.com/execute"
  }[name]
}


var parseCommand = function (command) {
  var matches = command.toLowerCase().match(/(\w+)\s*(.*)/)
  
  return {
    app: (matches.length > 1) ? matches[1] : null,
    parameters: (matches.length > 2) ? matches[2] : null,
  }
}
