var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('slackbotDatabase.db');
var newUser = db.prepare("INSERT INTO USERS (slackID, WINS, LOSSES, CRABNAME, CRABLVL, CRABEXP, CRABHPS, CRABSTR, CRABDEF, CRABDEX, CRABSPD, ELO) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
var checkIfUser = db.prepare("SELECT COUNT(1) FROM USERS WHERE slackID = ?");
var getUser = db.prepare("SELECT * FROM USERS WHERE slackID = ?");
const names = require("./names");

db.getAsync = function (sql, param) {
    var that = this;
    return new Promise(function (resolve, reject) {
        that.get(sql, param, function (err, row) {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
};

registerCommand = (msg) => {
    let x;
    db.getAsync(checkIfUser.sql, msg.user).then(row => {
        let y = "COUNT(1)";
        x = row[y];

        if(x){
            send(`You're already in my database <@${msg.user}>!`, msg.channel);
        } else {
            let arr = Array.from({length: 6}, () => Math.random());
    
            newUser.run(msg.user, 0, 0, names[Math.floor(arr[0] * names.length)], 1, 0, Math.ceil(arr[1] * 10), Math.ceil(arr[2] * 10), Math.ceil(arr[3] * 10), Math.ceil(arr[4] * 10), Math.ceil(arr[5] * 10), 1000);
    
            send(`All set <@${msg.user}>!`, msg.channel);
        }
    })
    .catch(err => {
        console.error(err);
    });
    console.log(x);
};

exports.registerCommand = registerCommand;