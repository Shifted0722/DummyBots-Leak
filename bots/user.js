var WebSocket = require('ws');

var MySql = require("mysql");

var save = require("json-pretty");
var fs = require("fs");
var bot = require("./bot.js");

module.exports = class user {
    constructor(ip, proxies) {
        var client = this;

        client.ip = ip;
        client.proxies = proxies ? proxies : [];

        client.checkStatus = false;

        client.aliviable = false;

        client.readySaveTimeZero = false;
        client.collectTrue = false;
        this.data = {};
        this.SQL = null;
        this.SQL = MySql.createConnection({

			host: "",
			user : "",
			password: '',
			database: '',
			port: "",
        });		
        this.SQL.query(`SELECT * FROM users WHERE ip='${client.ip}'`, (err, rows) => {
            if(!!err) {
                console.log(err)
            } else {
                //console.log(rows)
                this.data = {
                    ip: rows[0].ip,
                    maxbots: rows[0].max_bots,
                    time: rows[0].time_left,
                    package: rows[0].package,
                    start_time: rows[0].time_start
                }
                console.log(this.data)
                this.setUserStatus(this.data);
            }
        });
    }

    setUserStatus(status) {

        var client = this;

        client.alive_package = false;

        client.reason = {
            bots: 20,
            mbots: 0,
            time: 10000,
            timem: 10000,
            package: null
        }

        client.maxLoadMassBots = client.proxies.length;

        client.time_interval = null;

        client.server = null;
        client.origin = null;

        client.x = 0;
        client.y = 0;

        client.bots = [];

        if (status.time > 0) {
            client.alive_package = true;
            client.reason.time = status.time;
            client.reason.timem = status.start_time;
            client.reason.bots = 0;
            client.reason.botm = status.maxbots;
            client.reason.package = status.package;
        } else {
            client.alive_package = false;
        }
        client.aliviable = true;
        client.checkStatus = true;
        if(client.reason.time > 0) {
            client.sendStatus = true;
        } else {
            client.sendStatus = false;
        }
    }
    getTimeStatus() {
        if(this.reason.time == undefined) return;
        return this.reason.time;
    }
    getDestroyBots() {
        var client = this;
        this.SQL.query(`UPDATE users SET time_left = '${this.reason.time}' WHERE ip = '${this.ip}'`, (err) => {});
        if(client.bots == undefined) return
        if (client.bots.length > 0) {

            for (var i in client.bots) {
                var bot = client.bots[i];
                if (bot.ws && bot.ws.readyState === WebSocket.OPEN) {

                    bot.ws.close();
                }
            }
        }
        for (var d = 0; d < client.bots.length; d++) {
            client.bots.splice(d, 10000);
        }
        clearTimeout(client.botLoop);
    }
    getData(reason) {
        var client = this;
        if (client.checkStatus == false) return
        if (client.alive_package == false) {
            return;
        }
        if (client.server != reason.ip) {
            //if (client.server == null) return;
            client.server = reason.ip;
            client.origin = reason.origin;
            setTimeout(function() {
                if(client.server == null) return
                //this.SQL.query(`UPDATE users SET time_left = '${this.reason.time}' WHERE ip = '${this.ip}'`, (err) => {});
                client.getBotsStart();
            },1000);
            console.log("[Connection]", client.ip, "| User Data:".yellow, client.server, "|", client.origin);
        }
    }
    getTime() {
        var client = this;
        if (client.checkStatus == false) return
        if (client.time_interval == null) {
            client.time_interval = setInterval(function () {
                if (client.reason.time != 0) {
                    client.reason.time--;
                } else if(client.reason.time <= 0) {
                    client.sendStatus = false;
                    client.getDestroyBots();
                }
            }, 1000);
        }
    }
    getStatus() {
        var client = this;
        if (client.checkStatus == false) return
        client.reason.bots = 0;
        for (var i in client.bots) {

            var bot = client.bots[i];

            if (bot.canSpawn == true && bot.close == false) {
                client.reason.bots++;
                if (client.reason.bots > client.reason.botm) {
                    client.reason.bots--;
                }
            }
        }

        return client.reason;
    }
    getCoords(reason) {
        var client = this;
        if (client.alive_package == false) {
            return;
        }
        client.botPrototypeMove(reason.x, reason.y, reason.mode);
    }
    getBotsStart() {
        var client = this;

        if (client.checkStatus == false) return
        clearInterval(client.time_interval);
        client.time_interval = null;
        client.getDestroyBots();
        client.getTime();

        if(client.origin == "http://agariocity.pro") {
            client.botLoopInterval = 10;
        } else if(client.origin == "http://gaver.io") {
            client.botLoopInterval = 100;
        } else if(client.origin == "http://dual-agar.online"){
            client.botLoopInterval = 200;
        } else {
            client.botLoopInterval = 50;
        
        }

        var i = 1;
        client.d = 0;
        client.bots.push(new bot(client.d, client.proxies[Math.floor(Math.random() * client.proxies.length)], client.origin, client.reason.package));
        if (this.origin === "http://gaver.io") {
            if(this.server == null) return
            function makeid() {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i = 0; i < 43; i++)
                    text += possible.charAt(Math.floor(Math.random() * possible.length));

                return text;
            }
            var abc = this.server.split("=");
            this.gaver_server = abc[0] + "=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXUyJ9.eyJpcCI6IjE5MS4xOS4zNi4yNTEiLCJ0aW1lIjoxNTEzNDY3Nz" + "Q" + Math.floor(Math.random() * 5) + "LCJpYXQiOiIxNTEzNDY3OD" + "w" + Math.floor(Math.random() * 10) + "In0" + makeid();
        }
        function botLoop() {

            setTimeout(() => {

                if (client.reason.time == 0) {
                    client.getDestroyBots();
                }

                if (client.reason.time > 0) {
 
                    if (client.bots.length < 9999) {
                        if (client.reason.bots < client.reason.botm) {
                            client.bots.push(new bot(client.d, client.proxies[Math.floor(Math.random() * client.proxies.length)], client.origin, client.reason.package));
                        }
                    }
                    client.d++;
                    if (client.bots[i] !== void (0)) {
                        if (client.bots[i].canSpawn != true) {
                            if(client.origin == "http://gaver.io") {
                                client.bots[i].connect(client.gaver_server);
                            } else if(client.origin == "http://agariocity.pro"){
                                client.bots[i].connect(client.server)
                            } else {
                                client.bots[i].connect(client.server);
                            }
                        }
                    }
                    i++
                    botLoop();
                }
            }, client.botLoopInterval);
        }
        if(client.reason.time > 0) {
            botLoop();
        }
    }
    botPrototypeMove(x, y, mode) {
        var client = this;
        if (client.checkStatus == false) return
        for (var i = 0; i < client.bots.length; i++) {
            client.bots[i].setPos(x, y, mode);
        }
    }
    botSplit() {
        var client = this;
        if (client.checkStatus == false) return
        for (var i = 0; i < client.bots.length; i++) {
            client.bots[i].split();
        }
    }
    botEject() {
        var client = this;
        if (client.checkStatus == false) return
        for (var i = 0; i < client.bots.length; i++) {
            client.bots[i].eject();
        }
    }
    botCollect(checkStats) {
        var client = this;
        if (client.checkStatus == false) return
        client.collectTrue = checkStats;
        for (var i = 0; i < client.bots.length; i++) {
            client.bots[i].collect(client.collectTrue);
        }
    }
}