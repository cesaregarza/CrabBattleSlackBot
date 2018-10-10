const {
  RTMClient,
  WebClient
} = require("@slack/client");
const CLIENT_EVENTS = require("@slack/client");
const key = require("./ignoreMe/keys");
const rtm = new RTMClient(key.slackOAuth.botAccessToken);
const admin = ['UB5D97MFD'];
//The regexes to separate commands from normal text
const re = new RegExp("(?<=(^!crabbattle)|(^!cb)|(^!crab)).+", "gi");
const re1 = new RegExp("[a-zA-Z0-9]+", "gi");
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('slackbotDatabase.db');
const fnx = require("./functions");
//establish the database
db.serialize(()=>{
  db.run("CREATE TABLE IF NOT EXISTS USERS (id INTEGER PRIMARY KEY AUTOINCREMENT, slackID varchar(20), WINS SMALLINT, LOSSES SMALLINT, CRABNAME varchar(30), CRABLVL SMALLINT, CRABEXP INTEGER, CRABHPS SMALLINT, CRABSTR SMALLINT, CRABDEF SMALLINT, CRABDEX SMALLINT, CRABSPD SMALLINT, ELO INTEGER, SKILLPOINTS SMALLINT, GENERATION SMALLINT)");
});

class Command {
    constructor(cmd, fn){
        this.cmd = cmd;
        this.fn = fn;
    }
}

//This is an object of commands that follow the bot calling command !crabbatle, !cb, or !crab. It uses the previously defined class Command to feed in a function, then takes advantage that object[property] will call the object property.
const commands = {
    register: new Command("register", fnx.registerCommand),
    help: new Command("help", fnx.helpCommand),

};

//start up the interaction with Slack's RTM API
rtm.start();

rtm.on("message", msg => {

  // Skip messages that are from a bot or my own user ID
  if ((msg.subtype && msg.subtype === "bot_message") || (!msg.subtype && msg.user === rtm.activeUserId)) {
    return;
  }
  if (!msg.text) return;

  // Convert the message to lowercase
  msg.text = msg.text.toLowerCase();

  //filter out any text not preceded by one of the initializers. Returns falsey if message does not start with an initializer.
  let query = msg.text.match(re);

  if (!query) return;

  //separate everything after the initializer. Any character that's not alphanumeric will break the sequence. So the string "register bot" will return ["register", "bot"], "register!bot" will also return ["register", "bot"];
  let queryArray = query[0].match(re1);
  
  console.log(msg.text);
  console.log(query);
  console.log(queryArray);
  console.log(msg.channel);
  //If nothing follows the command, stop executing.
  if (!queryArray) return;

  //The resulting array will end up being in [command, option1, option2...] format, so we shift the array to split the command from the options
  let queryCommand = queryArray.shift();
  //Check if the command is valid
  if (!commands[queryCommand]){
      send(`I'm sorry <@${msg.user}>, that's not a valid command`, msg.channel);
      return;
  }
  //The real meat. Call upon the commands object using the queryCommand to find the property. Then, call the function defined in the property and pass the msg object as the initial parameter, and the queryArray, which now only contains the options, as the second parameter using the spread operator. Since too many parameters will not return an error in javascript, this is okay for us to use. This generalizes the call, and ensures that the same function can work for commands that require a single parameter as well as commands that have multiple parameters.
  commands[queryCommand].fn(msg, ...queryArray);
});

send = (info, channel) => {
  rtm
    .sendMessage(info, channel)
    // Returns a promise that resolves when the message is sent
    .then(msg => {
      console.log('');
    })
    .catch(console.error);
};

construct = () => {

}
