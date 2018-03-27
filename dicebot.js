var request = require('request');

module.exports = function (req, res, next) {
  // default roll is 2d6
  var matches;
  var times = 2;
  var die = 6;
  var modifier = "+";
  var modifier_value = 0;
  var rolls = [];
  var total = 0;
  var botPayload = {};

  if (req.body.text) {
    // parse roll type if specified
    matches = req.body.text.match(/^(\d{1,2})d(\d{1,2})($|\s*(\+|\-)(\d{1,2})$)/);
    //matches = req.body.text.match(/^(\d{1,2})d(\d{1,2})$/);
    console.log(matches);

    if (matches && matches[1] && matches[2]) {
      times = matches[1];
      die = matches[2];
      if (matches[3]){
        modifier = matches[4];
        modifier_value = Number(matches[5]);
        console.log(matches[4]);
        console.log(matches[5]);
      }

    } else {
      // send error message back to user if input is bad
      return res.status(200).send('<number>d<sides>');
    }
  }

  // roll dice and sum
  for (var i = 0; i < times; i++) {
    var currentRoll = roll(1, die);
    rolls.push(currentRoll);
    total += currentRoll;
  }

  // write response message and add to payload
  if (modifier_value){
    if (modifier == '+'){
      total = total + modifier_value;
      console.log(total)
    }

    else if(modifier == '-'){
      total = total - modifier_value;
      console.log(total)
    }

    botPayload.text = req.body.user_name + ' rolled ' + times + 'd' + die + ':\n' +
                      rolls.join(' + ') + ' (' + modifier + modifier_value + ') = *' + total + '*';
  } 
  else {
    botPayload.text = req.body.user_name + ' rolled ' + times + 'd' + die + ':\n' +
                      rolls.join(' + ') + ' = *' + total + '*';
  }
  botPayload.username = 'dicebot';
  botPayload.channel = req.body.channel_id;
  botPayload.icon_emoji = ':game_die:';

  // send dice roll
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


function roll (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
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
