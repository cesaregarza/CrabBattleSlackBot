var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('slackbotDatabase.db');
var newUser = db.prepare("INSERT INTO USERS (slackID, WINS, LOSSES, CRABNAME, CRABLVL, CRABEXP, CRABHPS, CRABSTR, CRABDEF, CRABDEX, CRABSPD, ELO) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
var checkIfUser = db.prepare("SELECT COUNT(1) FROM USERS WHERE slackID = ?");
var getUser = db.prepare("SELECT * FROM USERS WHERE slackID = ?");

registerCommand = (msg) => {
    console.log(checkIfUser.run(msg.user));
    let x = db.get(checkIfUser.sql, (err, row) => {
        if (err) {
            console.error(err);
        }
        return row;
    });
    console.log(x);
    if(x){
        send(`You're already in my database <@${msg.user}>!`, msg.channel);
    } else {
        let arr = Array.from({length: 6}, () => Math.random());

        newUser.run(msg.user, 0, 0, names[Math.floor(arr[0] * names.length)], 1, 0, Math.ceil(arr[1] * 10), Math.ceil(arr[2] * 10), Math.ceil(arr[3] * 10), Math.ceil(arr[4] * 10), Math.ceil(arr[5] * 10), 1000);

        send(`All set <@${msg.user}>!`, msg.channel);
    }
};

exports.registerCommand = registerCommand;