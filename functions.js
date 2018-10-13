var sqlite3 = require('sqlite3').verbose();
const currgen=3;
var db = new sqlite3.Database('slackbotDatabase.db');
var newUser = db.prepare(`INSERT INTO USERS (slackID, WINS, LOSSES, CRABNAME, CRABLVL, CRABEXP, CRABHPS, CRABSTR, CRABDEF, CRABDEX, CRABSPD, ELO, SKILLPOINTS, GENERATION) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?, ${currgen})`);
var checkIfUser = db.prepare("SELECT COUNT(1) FROM USERS WHERE slackID = ?");
var getUser = db.prepare("SELECT * FROM USERS WHERE slackID = ?");
var updateLevel = db.prepare("UPDATE USERS SET CRABLVL = CRABLVL + 1 WHERE  slackID = ?");
var checkIfUpdate = db.prepare(`SELECT COUNT(1) FROM USERS WHERE slackID = ? AND GENERATION=${currgen}`);
const names = require("./names");


const initialStats = [10, 7, 6, 5, 3];

//We'll define a new sqlite function that works as a promise. Because despite being a local database, db.get is still an async function. That is, it will not retrieve the value before the next line of code is executed. To prevent this, we establish it as a promise and give it a resolve and reject condition to allow for our callbacks to be put into a more appropriate form.
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

shuffle = ([...arr]) => {
    let x = arr.length;
    while (x) {
      const i = Math.floor(Math.random() * x--);
      [arr[x], arr[i]] = [arr[i], arr[x]];
    }
    return arr;
  };

checkIfUserandExecute = (userID, fnSuccess, optionsSuccessArray, fnFailure, optionsFailureArray) => {
    //First we want to check if the user already exists in our database. We abuse the fact that 0 is falsey to then use it in an if-else statement.
    db.getAsync(checkIfUser.sql, userID).then(row => {
        let y = "COUNT(1)";
        if (row[y]){
            db.getAsync(getUser.sql, userID).then(rw => {
                fnSuccess(rw, ...optionsSuccessArray);
            }).catch(er => {
                console.error(er);
            });
        } else {
            fnFailure(row, ...optionsFailureArray);
        }
    })
    .catch(err => {
        console.error(err);
    });
};

registerCommand = (msg) => {
    let fnSuccess = (user) => {
        send(`You're already in my database <@${msg.user}>! Your crab is named ${user.CRABNAME}, is level ${user.CRABLVL} and has ${user.CRABHPS} health, ${user.CRABSTR} strength, ${user.CRABDEF} defense, ${user.CRABDEX} dexterity, and ${user.CRABSPD} speed! Your crab has won ${user.WINS} fights and has lost ${user.LOSSES}. Your ELO is also ${user.ELO}`, msg.channel);
    };

    let fnFailure = () => {
        let arr = shuffle(initialStats);
        let arr1 = [names[Math.floor(Math.random() * names.length)], 1, 0, ...arr];
        newUser.run(msg.user, 0, 0, ...arr1, 1000, 0);
    
        send(`All set <@${msg.user}>! Your crab is named ${arr1[0]} and has ${arr1[3]} health, ${arr1[4]} strength, ${arr1[5]} defense, ${arr1[6]} dexterity, ${arr1[7]} speed! I've also set your ELO at 1000`, msg.channel);
    };

    checkIfUserandExecute(msg.user, fnSuccess, [""], fnFailure, [""]);
    
};

helpCommand = (msg) => {
    send(`Here are a list of my commands! \n*Register*: If you don't have a crab already, this will make one for you!\n*Update*: If there's been an update, this will update your previous generation crab to the newest one\n*Stats*: Show your crab's stats!`, msg.channel);
    return;
};

showStatsCommand = (msg) => {

    fnSuccess = (user) => {
        send(`Your crab, ${user.CRABNAME}, is level ${user.CRABLVL} with ${user.CRABEXP ? user.CRABEXP : "no"} experience and has ${user.CRABHPS} health, ${user.CRABSTR} strength, ${user.CRABDEF} defense, ${user.CRABDEX} dexterity, and ${user.CRABSPD} speed! Your crab has won ${user.WINS} fights and has lost ${user.LOSSES}. Your ELO is also ${user.ELO}`, msg.channel);
    };

    fnFailure = () => {
        send(`You don't have a crab! Let me make one for you`, msg.channel);
        registerCommand(msg);
    };

    checkIfUserandExecute(msg.user, fnSuccess, [""], fnFailure, [""]);
};

updateCommand = (msg) => {

    fnSuccess = (user) => {
        send(`Your crab, ${user.CRABNAME}, is out of date! Their generation is ${user.GENERATION} when the newest generation is ${currgen}\nUpdating your crab`, msg.channel);
        updateCrab(user);
    };
    
    fnFailure = () => {
        send(`You're not registered! Here, let me make a crab for you`, msg.channel);
        registerCommand(msg);
    };

    db.getAsync(checkIfUpdate.sql, msg.user).then(row => {
        let y = "COUNT(1)";

        if(!row[y]){
            checkIfUserandExecute(msg.user, fnSuccess, [""], fnFailure, [""]);
        } else {
            send(`Your crab is the most current generation`, msg.channel);
        }
    })
    .catch(err => {
        console.error(err);
    });
};

updateCrab = (userObj) => {

};

battleCrabCommand = (msg, user2ID) => {
    let user1, user2;
    db.getAsync(checkIfUser.sql, msg.user).then(row => {
        let y = "COUNT(1)";
        if (row[y]){
            db.getAsync(getUser.sql, msg.user).then(rw => {

            })
        }
    })
};

experience = (currentLevel, currentExperience) => {
    if (currentExperience > ((currentLevel + 1) ** 3)) {

    }
};

exports.registerCommand = registerCommand;
exports.helpCommand = helpCommand;
exports.updateCommand = updateCommand;
exports.showStatsCommand = showStatsCommand;