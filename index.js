const {
  RTMClient,
  WebClient
} = require("@slack/client");
const CLIENT_EVENTS = require("@slack/client");
const key = require("./ignoreMe/keys");
const rtm = new RTMClient(key.slackOAuth.botAccessToken);
const admin = ['UB5D97MFD'];
const re = new RegExp("(?<=(^!crabbattle)|(^!cb)|(^!crab)).+", "gi");
const re1 = new RegExp("[a-zA-Z0-9]+", "gi");
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('slackbotDatabase.db');
const fnx = require("./functions");
db.serialize(()=>{
  db.run("CREATE TABLE IF NOT EXISTS USERS (id INTEGER PRIMARY KEY AUTOINCREMENT, slackID varchar(20), WINS SMALLINT, LOSSES SMALLINT, CRABNAME varchar(30), CRABLVL SMALLINT, CRABEXP INTEGER, CRABHPS SMALLINT, CRABSTR SMALLINT, CRABDEF SMALLINT, CRABDEX SMALLINT, CRABSPD SMALLINT, ELO INTEGER)");
});

var newUser = db.prepare("INSERT INTO USERS (slackID, WINS, LOSSES, CRABNAME, CRABLVL, CRABEXP, CRABHPS, CRABSTR, CRABDEF, CRABDEX, CRABSPD, ELO) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
var checkIfUser = db.prepare("SELECT COUNT(1) FROM USERS WHERE slackID = ?");
var getUser = db.prepare("SELECT * FROM USERS WHERE slackID = ?");

class Command {
    constructor(cmd, fn, options){
        this.cmd = cmd;
        this.fn = fn;
        this.options = options;
    }
}

const commands = {
    register: new Command("register", fnx.registerCommand),
    help: new Command("help", fnx.helpCommand),

};

rtm.start();

rtm.on("message", msg => {

  // Skip messages that are from a bot or my own user ID
  if ((msg.subtype && msg.subtype === "bot_message") || (!msg.subtype && msg.user === rtm.activeUserId)) {
    return;
  }
  if (!msg.text) return;

  // Convert the message to lowercase
  msg.text = msg.text.toLowerCase();

  let query = msg.text.match(re);

  if (!query){
      return;
  }
    
  let queryArray = query[0].match(re1);
  
  console.log(msg.text);
  console.log(query);
  console.log(queryArray);
  console.log(msg.channel);
  if (!queryArray){
      return;
  }

  let queryCommand = queryArray.shift();
  if (!commands[queryCommand]){
      send(`I'm sorry <@${msg.user}>, that's not a valid command`, msg.channel);
      return;
  }

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
