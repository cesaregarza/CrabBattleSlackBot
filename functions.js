var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('slackbotDatabase.db');
var newUser = db.prepare("INSERT INTO USERS (slackID, WINS, LOSSES, CRABNAME, CRABLVL, CRABEXP, CRABHPS, CRABSTR, CRABDEF, CRABDEX, CRABSPD, ELO, SKILLPOINTS) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)");
var checkIfUser = db.prepare("SELECT COUNT(1) FROM USERS WHERE slackID = ?");
var getUser = db.prepare("SELECT * FROM USERS WHERE slackID = ?");
//var updateLevel = db.prepare("UPDATE USERS SET (CRABLVL = CRABLVL + 1, CRABEXP = 0) WHERE  slackID = ?");
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
            db.getAsync(getUser.sql, msg.user).then(rw => {
                send(`You're already in my database <@${msg.user}>! Your crab is named ${rw.CRABNAME}, is level ${rw.CRABLVL} and has ${rw.CRABHPS} health, ${rw.CRABSTR} strength, ${rw.CRABDEF} defense, ${rw.CRABDEX} dexterity, and ${rw.CRABSPD} speed! Your crab has won ${rw.WINS} fights and has lost ${rw.LOSSES}. Your ELO is also ${rw.ELO}`, msg.channel);
            });
        } else {
            let arr = Array.from({length: 6}, () => Math.random());
            let arr2 = [names[Math.floor(arr[0] * names.length)], 1, 0, Math.ceil(arr[1] * 10), Math.ceil(arr[2] * 10), Math.ceil(arr[3] * 10), Math.ceil(arr[4] * 10), Math.ceil(arr[5] * 10)];
            newUser.run(msg.user, 0, 0, ...arr2, 1000, 0);
    
            send(`All set <@${msg.user}>! Your crab is named ${arr2[0]} and has ${arr2[3]} health, ${arr2[4]} strength, ${arr2[5]} defense, ${arr2[6]} dexterity, ${arr2[7]} speed! I've also set your ELO at 1000`, msg.channel);
        }
    })
    .catch(err => {
        console.error(err);
    });
};

helpCommand = (msg) => {
    send(`Here are a list of my commands! \n *Register*: If you don't have a crab already, this will make one for you!`, msg.channel);
    return;
};

showStats = (msg) => {
    let x;
}

experience = (currentLevel, currentExperience) => {
    if (currentExperience > ((currentLevel + 1) ** 3)) {

    }
}

exports.registerCommand = registerCommand;
exports.helpCommand = helpCommand;