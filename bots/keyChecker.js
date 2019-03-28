var fs = require("fs");
var user = fs.readFileSync("./users.js", "utf-8");
var users = JSON.parse(user);
var sv = require("json-pretty");
users.length = users.length || 1;
module.exports = function checker(key, ip, reg) {
    if(key == undefined || key == null) return
    this.userIp = ip;
    this.register = false;
    this.checkKey = key;
    if (key.length == 48) {
        this.key = "Ultimate";
        this.readUltimateKeys = fs.readFileSync("./keyPackages/keyUltimate.js", "utf-8");
        this.parseUltimateKey = JSON.parse(this.readUltimateKeys);
        for (i = 0; i < parseUltimateKey.length; i++) {
            if (parseUltimateKey[i].key == this.checkKey) {
                console.log("Activate Key:" + this.checkKey, "IP:", ip);
                for (d = 0; d < users.length; d++) {
                    if (users[d].ip == this.userIp) {
                        users.splice(d, 1);
                        fs.writeFileSync("./users.js", sv(users));
                        this.register = false;
                    }
                }
                if (this.register != true) {
                    users.push({
                        "ip": this.userIp,
                        "maxbots": "150",
                        "package": "Ultimate",
                        "register": true,
                        "stime": 10800,
                        "time": 10800,
                        "already": false
                    });
                    try {
                        fs.writeFileSync("./users.js", sv(users));
                    } catch(e) {
                        console.log(e);
                        fs.writeFileSync("./users.js", sv(users));
                    }
                    this.register = true;
                }
                parseUltimateKey.splice(i, 1);
                fs.writeFileSync("./keyPackages/keyUltimate.js", sv(parseUltimateKey));
            }
        }
    } else if (key.length == 47) {
        this.key = "Classic";
        this.readClassicKeys = fs.readFileSync("./keyPackages/keyClassic.js", "utf-8");
        this.parseClassicKey = JSON.parse(this.readClassicKeys);
        this.parseClassicKey.length = this.parseClassicKey.length || 1;
        for (i = 0; i < parseClassicKey.length; i++) {
            if (parseClassicKey[i].key == this.checkKey) {
                console.log("Activate Key:" + this.checkKey, "IP:", ip);
                for (d = 0; d < users.length; d++) {
                    if (users[d].ip == this.userIp) {
                        users.splice(d, 1);
                        fs.writeFileSync("./users.js", sv(users));
                        this.register = false;
                    }
                }

                if (this.register != true) {
                    users.push({
                        "ip": this.userIp,
                        "maxbots": "50",
                        "package": "Classic",
                        "register": true,
                        "stime": 3600,
                        "time": 3600,
                        "already": false
                    });
                    
                    try {
                        fs.writeFileSync("./users.js", sv(users));
                    } catch(e) {
                        console.log(e);
                        fs.writeFileSync("./users.js", sv(users));
                    }
                    this.register = true;
                }
                parseClassicKey.splice(i, 1);
                fs.writeFileSync("./keyPackages/keyClassic.js", sv(parseClassicKey));
            }
        }
    } else if (key.length == 44) {
        this.key = "Gold";
        this.readGoldKeys = fs.readFileSync("./keyPackages/keyGold.js", "utf-8");
        this.parseGoldKey = JSON.parse(this.readGoldKeys);
        this.parseGoldKey.length = this.parseGoldKey.length || 1;
        for (i = 0; i < parseGoldKey.length; i++) {
            if (parseGoldKey[i].key == this.checkKey) {
                console.log("Activate Key:" + this.checkKey, "IP:", ip);
                for (d = 0; d < users.length; d++) {
                    if (users[d].ip == this.userIp) {
                        users.splice(d, 1);
                        this.register = false;
                        fs.writeFileSync("./users.js", sv(users));
                    }

                }
                if (this.register != true) {
                    users.push({
                        "ip": this.userIp,
                        "maxbots": "100",
                        "package": "Gold",
                        "register": true,
                        "stime": 7200,
                        "time": 7200,
                        "already": false
                    });
                    try {
                        fs.writeFileSync("./users.js", sv(users));
                    } catch(e) {
                        console.log(e);
                        fs.writeFileSync("./users.js", sv(users));
                    }
                    this.register = true;
                }
                parseGoldKey.splice(i, 1);
                fs.writeFileSync("./keyPackages/keyGold.js", sv(parseGoldKey));
            }
        }
    }
}