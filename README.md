Creates a simple slackbot for use on heroku (or elsewhere) for rolling dice. 
This allows the use of /roll (num)d(num) to auto roll some dice and get a result. 
You can also provide added modifers like /roll 1d6 +2 and roll 1 six sided die and add 2 to the result.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/plumbis/slack-dicebot)


1.) Create Slack incoming webhook

2.) Webhook URL goes in the dicebot.js file, send() uri variable.

3.) "Customize Name" on slack is the name that will be used in chat. For example "Dicebot"

4.) Create a new Slack Slash command. This is what is used in chat, for example /roll 1d6

5.) Slash command URL is your heroku server info + /roll. "roll" comes the app.js command router. I don't know anything about node.js to explain how this works. 

6.) Method must be POST

7.) If using the "deploy to heroku" button, plug in your domain and the Incoming Webhook URL seen in the slack settings.

8.) After the app is deployed take the app name (i.e., squish-pancake-23384) and put it in the Slack slash command URL

