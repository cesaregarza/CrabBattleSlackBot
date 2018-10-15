var sqlite3 = require('sqlite3').verbose();
const currgen=5;
var db = new sqlite3.Database('slackbotDatabase.db');
var newUser = db.prepare(`INSERT INTO USERS (slackID, WINS, LOSSES, CRABNAME, CRABLVL, CRABEXP, CRABHPS, CRABSTR, CRABDEF, CRABDEX, CRABSPD, CRABNATURE, ELO, SKILLPOINTS, GENERATION) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?, ${currgen})`);
var checkIfUser = db.prepare("SELECT COUNT(1) FROM USERS WHERE slackID = UPPER(?)");
var getUser = db.prepare("SELECT * FROM USERS WHERE slackID = UPPER(?)");
var updateLevel = db.prepare("UPDATE USERS SET CRABLVL = CRABLVL + 1 WHERE  slackID = UPPER(?)");
var checkIfUpdate = db.prepare(`SELECT COUNT(1) FROM USERS WHERE slackID = UPPER(?) AND GENERATION=${currgen}`);
var updateStuff = (Arr) => {
    return db.prepare(`UPDATE USERS SET ${sqlOutput(Arr)} WHERE slackID=?`);
};
const names = require("./names");
const accCurves = require("./accuracyCurves");

//used for verifying if slackID is valid
const re = new RegExp("(?<=^ub[0-9])[a-zA-Z0-9]{6}$", "gi");

//Crab's initial stat distribution
const initialStats = [7, 6, 5, 3];
const natures = ["reckless", "serious", "calm"];
const statNames = ["CRABHPS", "CRABSTR", "CRABDEF", "CRABDEX", "CRABSPD"];
//Logic Functions that might or might not be useful later;
const logic = {
    NAND: (a, b) => {
        return !(a && b);
    },
    XOR: (a, b) => {
        return (a && !b) || (!a && b);
    },
    NOR: (a, b) => {
        return !(a || b);
    },
};

const mLogic = {
    //Returns true if all are true. Revert to find if at least one is false
    AND: (Arr) => {
        return Arr.reduce((a, b) => a && b, true);
    },
    //Returns true if at least one is true. Revert to find if all are false
    OR: (Arr) => {
        return Arr.reduce((a, b) => a || b, false);
    },
    //Returns true if all elements are equal
    equals: (Arr) => {
      return Arr.every(a => a==Arr[0]);
    },
};

var sqlOutput = (Arr) => {
  let p = "";
  while (Arr.length > 1) {
    p += `${Arr[0][0]} = ${Arr[0][1]}, `
    Arr.shift();
  }
  p += `${Arr[0][0]} = ${Arr[0][1]}`;
  return p;
};

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

checkIfUserAndExecutePromise = function (userID) {
    return new Promise (function(resolve, reject) {
        db.getAsync(checkIfUser.sql, userID).then(row => {
            let y = "COUNT(1)";
            if (row[y]) {
                db.getAsync(getUser.sql, userID).then(rw => {
                    resolve(rw);
                }).catch(err => {
                    console.error(err);
                });
            } else {
                reject(false);
            }
        })
        .catch(err => {
            console.error(err);
        });
    });
};

checkIfValidID = (suspectedID) => {
    if (!suspectedID) return false;
    if (typeof suspectedID != "string") return false;
    
    return suspectedID.match(re);
};

registerCommand = (msg) => {
    checkIfUserAndExecutePromise(msg.user).then(user => {
        send(`You're already in my database <@${msg.user}>! Your crab is named ${user.CRABNAME}, is level ${user.CRABLVL} and has ${user.CRABHPS} health, ${user.CRABSTR} strength, ${user.CRABDEF} defense, ${user.CRABDEX} dexterity, and ${user.CRABSPD} speed! Your crab is ${user.CRABNATURE}, has won ${user.WINS} fights and has lost ${user.LOSSES}. Your ELO is also ${user.ELO}`, msg.channel);
    })
    .catch(result => {
        let arr = shuffle(initialStats);
        let arr1 = [names[Math.floor(Math.random() * names.length)], 1, 0, 10, ...arr, natures[Math.floor(Math.random() * 3)]];
        newUser.run(msg.user, 0, 0, ...arr1, 1000, 0);
    
        send(`All set <@${msg.user}>! Your crab is named ${arr1[0]}, is ${arr1[8]}, and has ${arr1[3]} health, ${arr1[4]} strength, ${arr1[5]} defense, ${arr1[6]} dexterity, ${arr1[7]} speed! I've also set your ELO at 1000`, msg.channel);
    });
    
};

helpCommand = (msg) => {
    send(`Here are a list of my commands! \n*Register*: If you don't have a crab already, this will make one for you!\n*Update*: If there's been an update, this will update your previous generation crab to the newest one\n*Stats*: Show your crab's stats!\n*Battle* @user: Fight someone else's crab!`, msg.channel);
    return;
};

showStatsCommand = (msg) => {

    checkIfUserAndExecutePromise(msg.user)
    .then(user => {
        send(`Your crab, ${user.CRABNAME}, is level ${user.CRABLVL} with ${user.CRABEXP ? user.CRABEXP : "no"} experience and has ${user.CRABHPS} health, ${user.CRABSTR} strength, ${user.CRABDEF} defense, ${user.CRABDEX} dexterity, and ${user.CRABSPD} speed! Your crab is ${user.CRABNATURE}, has won ${user.WINS} fights and has lost ${user.LOSSES}. Your ELO is also ${user.ELO}`, msg.channel);
    })
    .catch(result => {
        send(`You don't have a crab! Let me make one for you`, msg.channel);
        registerCommand(msg);
    });
};

updateCommand = (msg) => {

    db.getAsync(checkIfUpdate.sql, msg.user).then(row => {
        let y = "COUNT(1)";

        if(!row[y]){
            checkIfUserAndExecutePromise(msg.user)
            .then(user => {
                send(`Your crab, ${user.CRABNAME}, is out of date! Their generation is ${user.GENERATION} when the newest generation is ${currgen}\nUpdating your crab`, msg.channel);
                updateCrab(user);
                send(`Crab updated!`, msg.channel);
            })
            .catch(result => {
                console.error(result);
                send(`You're not registered! Here, let me make a crab for you`, msg.channel);
                registerCommand(msg);
            });
        } else {
            send(`Your crab is the most current generation`, msg.channel);
        }
    })
    .catch(err => {
        console.error(err);
    });
};

updateCrab = (userObj) => {
    if (userObj.GENERATION == 3){
        updateArray = [
            ["CRABNATURE", `'${natures[Math.floor(Math.random()*3)]}'`],
            ["GENERATION", 4]
        ];
    }

    if (userObj.GENERATION == 4){
        for (let i = 0; i < statNames.length; i++){
            if (userObj[statNames[i]] == 10){
              [userObj[statNames[0]], userObj[statNames[i]]] = [userObj[statNames[i]], userObj[statNames[0]]];
            }
          }
          updateArray = [
              ["CRABHPS", userObj.CRABHPS],
              ["CRABSTR", userObj.CRABSTR],
              ["CRABDEF", userObj.CRABDEF],
              ["CRABDEX", userObj.CRABDEX],
              ["CRABSPD", userObj.CRABSPD],
              ["GENERATION", 5]
          ];
        }
        
    updateStuff(updateArray).run(userObj.slackID);
};

battleCrabCommand = (msg, user2ID) => {
    if (!checkIfValidID(user2ID)){
        send(`I'm sorry, ${user2ID} is not a valid user slack ID`, msg.channel);
        return;
    }

    if (msg.user.toUpperCase() == user2ID.toUpperCase()){
        send(`You can't battle yourself, <@${msg.user}>`, msg.channel);
        return;
    }

    Promise.all([db.getAsync(checkIfUpdate.sql, msg.user), db.getAsync(checkIfUpdate.sql, user2ID)])

    .then(results => {
        let y = "COUNT(1)";
        if (!results[0][y] || !results[1][y]){
            send(`I'm sorry, both participants need to have updated crabs to battle`, msg.channel);
            throw "One not updated";
        }
    })

    .then(() => Promise.all([checkIfUserAndExecutePromise(msg.user).catch(result => {return result;}), checkIfUserAndExecutePromise(user2ID).catch(result => {return result;})]))

    .then(results => {

        let both = logic.NOR(...results);

        if (logic.NAND(...results)) {
          send(`I'm sorry, <@${msg.user}>,${both ? ' neither' : ''} ${!results[0] ? 'you' : ''}${both ? ' nor' : ''} ${!results[1] ? '<@' + user2ID.toUpperCase() + '>' : ''} ${results[1] || both ? 'are':'is not'} registered`, msg.channel);
        } else {
          let winner = battleCrabs(results);
          send(`Battle would be successful, <@${winner.slackID}> wins`, msg.channel);
        }
    })
    .catch(err => console.error(err));
};

battleCrabs = (arr) => {
    let first, second;
    do{
      let flip = Math.random();

      if (arr[0].CRABSPD > arr[1].CRABSPD) {
        first = arr[0];
        second = arr[1];
      } else if (arr[0].CRABSPD > arr[1].CRABSPD) {
        first = arr[1];
        second = arr[0];
      } else {
        first = arr[Math.floor(flip * 2)];
        second = arr[(Math.floor(flip * 2) + 1) % 2];
      }

      [first, second] = damagePhase(first, second);
      if (second.CRABHPS <= 0) {
        return first;
      }
      [second, first] = damagePhase(second, first);
      if (first.CRABHPS <= 0) {
        return second;
      }
    } while(first.CRABHPS > 0 && second.CRABHPS >0);
};

damagePhase = (attacker, defender) => {
    acc = accuracy(attacker.CRABDEX, attacker.CRABNATURE);
    dmg = (damage(attacker.CRABSTR, defender.CRABDEF));

    if (acc >= Math.random()){
        //hit goes through
        defender.CRABHPS -= dmg;
        console.log(`HIT! ${attacker.CRABNAME} deals ${dmg} damage!`);
    }

    return [attacker, defender];
};

accuracy = (dex, nature) => {
    return accCurves[nature][dex];
};

damage = (attack, defense) => {
    return (((attack/2.5) ** 2) / defense)+1;
};

experience = (currentLevel, currentExperience) => {
    if (currentExperience > ((currentLevel + 1) ** 3)) {

    }
};

exports.registerCommand = registerCommand;
exports.helpCommand = helpCommand;
exports.updateCommand = updateCommand;
exports.showStatsCommand = showStatsCommand;
exports.battleCrabCommand = battleCrabCommand;