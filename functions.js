registerCommand = () => {
    if(checkIfUser.run(msg.user)){
        send(`You're already in my database <@${msg.user}!`);
    } else {
        let arr = Array.from({length: 6}, () => Math.random());

        newUser.run(msg.user, 0, 0, names[Math.floor(arr[0] * names.length)], 1, 0, Math.ceil(arr[1] * 10), Math.ceil(arr[2] * 10), Math.ceil(arr[3] * 10), Math.ceil(arr[4] * 10), Math.ceil(arr[5] * 10), 1000);

        send(`All set <@${msg.user}>`);
    }
};