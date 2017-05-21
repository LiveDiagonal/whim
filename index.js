var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var twilio = require('twilio');
var twilioClient = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

app.set('port', (process.env.PORT || 5000));

app.get('/command', function(request, response) {
  response.send("ok");
});

app.use(bodyParser.json());

app.post('/whim', function(req, res, next) {
  twilioClient.messages.create({
    body: req.body.Body,
    to: process.env.SMS_TO,
    from: process.env.SMS_FROM
  })
  .then((responseData) => {
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(responseData.body);
  })
  .catch(next)
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
