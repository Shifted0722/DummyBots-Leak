var fs = require("fs");
var sv = require("json-pretty");
module.exports = class getKey {
    constructor(levelKey, IP) {
        this.ip = IP;
        this.generateKey = require("./keyGenerator.js");
        this.keyLvl = levelKey;
        this.key = this.generateKey(this.keyLvl);
        this.readUltimateKeys = null;
        this.readGoldKeys = null;
        this.readClssicKeys = null;
        this.parseUltimateKey = null;
        this.parseGoldKey = null;
        this.parseClassicKey = null;
        if (levelKey == 1) {
            this.keyUltimate();
        } else if (levelKey == 2) {
            this.keyGold();
        } else if (levelKey == 3) {
            this.keyClassic();
        }
    }
    keyUltimate() {
        this.readUltimateKeys = fs.readFileSync("./keyPackages/keyUltimate.js", "utf-8");
        this.parseUltimateKey = JSON.parse(this.readUltimateKeys);
        this.parseUltimateKey.push({
            "key": this.key
        });
        console.log(this.parseUltimateKey);
        fs.writeFileSync("./keyPackages/keyUltimate.js", sv(this.parseUltimateKey));
    }
    keyGold() {
        this.readGoldKeys = fs.readFileSync("./keyPackages/keyGold.js", "utf-8");
        this.parseGoldKey = JSON.parse(this.readGoldKeys);
        this.parseGoldKey.push({
            "key": this.key
        });
        console.log(this.parseGoldKey);
        fs.writeFileSync("./keyPackages/keyGold.js", sv(this.parseGoldKey));
    }
    keyClassic() {
        this.readClassicKeys = fs.readFileSync("./keyPackages/keyClassic.js", "utf-8");
        this.parseClassicKey = JSON.parse(this.readClassicKeys);
        this.parseClassicKey.push({
            "key": this.key
        });
        console.log(this.parseClassicKey);
        fs.writeFileSync("./keyPackages/keyClassic.js", sv(this.parseClassicKey));
    }
    keyInfo() {
        return this.key;
    }
}