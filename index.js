const {
  RTMClient,
  WebClient
} = require("@slack/client");
const CLIENT_EVENTS = require("@slack/client");
const key = require("./keys");
const rtm = new RTMClient(key.slackOAuth.botAccessToken);
const admin = ['UB5D97MFD'];
const re = new RegExp("(?<=(^!crabbattle)|(^!cb)|(^!crab)).+", "gi");
const re1 = new RegExp("[a-zA-Z\d]+", "gi");
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('slackbotDatabase.db');
const fnx = require("./functions");
const names = require("./names");
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

};

rtm.start();

rtm.on("message", msg => {

  // Skip messages that are from a bot or my own user ID
  if ((msg.subtype && msg.subtype === "bot_message") || (!msg.subtype && msg.user === rtm.activeUserId)) {
    return;
  }

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

  commands[queryArray[0]].fn();


  // if (hi.indexOf(msg.text) != -1 && msg.user == 'UB5FHHXPV') {
  //     send("Hi Master.", msg.channel);
  // } else if (hi.indexOf(msg.text) != -1) {
  //     send("Hi, <@" + msg.user + ">",msg.channel);
  // } else if ( msg.text == "bye" && msg.user == "UB5FHHXPV") {
  //     send("Bye Grand Master!!", msg.channel);
  // }  else if ( msg.text == "say hello" && msg.user == "UB5FHHXPV") {
  //     send("Hello <!channel>", msg.channel);
  // }  else if ( msg.text.slice(msg.text.length - 6 ,msg.text.length) == "ready?") {
  //     send("Ready for what <@" + msg.user + ">?", msg.channel);
  // }  else if ( msg.text.slice(msg.text.length - 2, msg.text.length) == "??") {
  //     send("What's wrong with you <@" + msg.user + ">?", msg.channel);
  // } else if ( msg.text.charAt(msg.text.length - 1) == "?") {
  //     send("I don't have money <@" + msg.user + ">", msg.channel);
  // } else if ( msg.text == "yeah") {
  //     send("Yeah what <@" + msg.user + ">?", msg.channel);
  // } else if ( msg.text.slice(0,4) == "drop") {
  //     send("Deleting all the feelings for <@" + msg.user + ">", msg.channel);
  // } else if ( msg.text.slice(0,7) == "y ahora") {
  //     send("Yo juego contigo, a que quieres jugar <@" + msg.user + ">?", msg.channel);
  // } else if ( msg.text.slice(0,4) == "jaja") {
  //     send("Mucha risa <@" + msg.user + ">?", msg.channel);
  // } else if ( msg.text == "grr" && msg.user == "UB5FHHXPV") {
  //     send("GGGGGRRRRRRRRR!!!!!!!!", msg.channel);
  // } else if ( msg.text == '!status' ) {
  //     let temp = game == 1 ? 'on'  : 'off';
  //     send ('The game status is: ' + temp, msg.channel);
  // } else if ( msg.text == "start game" && game == 0) {
  //     game = 1;
  //     send('Let the games begin, who want to play tic tac toe? (Responde: me)', msg.channel);  
  // }
  // game == 1 && msg.user == 'UB5FHHXPV' && msg.text == "end game" ? endGame(msg.channel) : null;
  // game == 1 && user1 != '' && user2 != '' && activeUser == msg.user ? updateGame(msg.text.charAt(0), msg.text.charAt(1), msg.channel) : null;
  // game == 1 && (user1 == '' || user2 == '') ? addPlayer(msg.text, msg.user, msg.channel) : null;
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

messageRecieved = (cmd, option1, option2, option3) => {

};

registerCommand = () => {
    if(checkIfUser.run(msg.user)){
        send(`You're already in my database <@${msg.user}>!`);
    } else {
        let arr = Array.from({length: 6}, () => Math.random());

        newUser.run(msg.user, 0, 0, names[Math.floor(arr[0] * names.length)], 1, 0, Math.ceil(arr[1] * 10), Math.ceil(arr[2] * 10), Math.ceil(arr[3] * 10), Math.ceil(arr[4] * 10), Math.ceil(arr[5] * 10), 1000);

        send(`All set <@${msg.user}>`);
    }
};

construct = () => {

}
