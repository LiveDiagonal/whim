require('dotenv').config()

var express = require('express')
var app = express()

var bodyParser = require('body-parser')
var MessagingResponse = require('twilio').twiml.MessagingResponse
var processCommand = require('./lib/process_command')


app.set('port', (process.env.PORT || 5000))

app.use(express.static(__dirname + '/public'))

app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.get('/', function (request, response) {
  response.render("pages/index")
})

app.post('/command', function(request, response) {
  processCommand(request.body.command)
    .then(function(message) {
      response.send(message)
    })
})

app.post('/whim', function(req, res, next) {
  var twiml = new MessagingResponse();

  processCommand(req.body.Body)
    .then(function(message) {
      // -\n is hack for annoying trial message
      twiml.message("-\n" + message)
      res.writeHead(200, {'Content-Type': 'text/xml'})
      res.end(twiml.toString())
    })
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'))
})