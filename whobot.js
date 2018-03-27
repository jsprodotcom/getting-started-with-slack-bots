var request = require('request');
var users = require('./whobot.json');
var randomWhoPrev = -1;

module.exports = function (req, res, next) {
  console.log('req');
  console.log(req);
  console.log('res');
  console.log(res);
  console.log('next');
  console.log(next);

  var botPayload = {}; 
  var randomWho = -1;

  for (; randomWho == -1 || randomWhoPrev == randomWho;)
    randomWho = Math.floor(Math.random()*users.length);
  randomWhoPrev = randomWho;

  var message = 'The winner is ';
  if (req.body.text)
    message = req.body.text + ' is given to ';

  botPayload.text = message + users[randomWho];

  botPayload.channel = req.body.channel_id;

  send(botPayload, function (error, status, body) {
    if (error) {
      return next(error);

    } else if (status !== 200) {
      // inform user that our Incoming WebHook failed
      return next(new Error('Incoming WebHook: ' + status + ' ' + body));

    } else {
      return res.status(200).end();
    }
  });
}

function send (payload, callback) {
  var path = process.env.INCOMING_WEBHOOK_PATH;
  var uri = process.env.SLACK_WEBHOOK_URL;
 
  request({
    uri: uri,
    method: 'POST',
    body: JSON.stringify(payload)
  }, function (error, response, body) {
    if (error) {
      return callback(error);
    }

    callback(null, response.statusCode, body);
  });
}
