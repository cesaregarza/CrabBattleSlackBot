class Crab {
    constructor(name, hps, str, def, dex, spd, nature, maxlevel){
        this.CRABNAME = name;
        this.CRABHPS = hps;
        this.CRABSTR = str;
        this.CRABDEF = def;
        this.CRABDEX = dex;
        this.CRABSPD = spd;
        this.CRABNATURE = nature;
        this.MAXLEVEL = maxlevel;
    }
}

module.exports = {
    baby: new Crab("Weeny", 5, 2, 8, 2, 2, "calm", 2),
    easy: new Crab("Kid Krab", 10, 8, 2, 1, 1, "calm", 5),
    medium: new Crab("Krabby", 15, 12, 15, 8, 20, "reckless", 10),
    hard: new Crab("Killer Krab", 20, 20, 20, 20, 20, "calm", 15),
    boss: new Crab("King Krab", 30, 30, 30, 30, 30, "calm", 20),
    superboss: new Crab("Crab Supreme", 40, 40, 40, 40, 40, "calm", 25),
    hyperboss: new Crab("Aquaman", 50, 50, 50, 50, 50, "calm", 30)
};