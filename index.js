require('dotenv').config()

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var twilio = require('twilio');
var MessagingResponse = twilio.twiml.MessagingResponse;

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
  response.render("pages/index")
});

app.get('/command', function(request, response) {
  response.send({
    success: true,
    message: "hello world"
  });
});

app.post('/whim', function(req, res, next) {
  var twiml = new MessagingResponse();
  twiml.message(req.body.Body);

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
