process.on('uncaughtException', function(err){
    var e = '' + err;
    if(e != 'Error: Socket Closed' && e != 'Error: Connection Timed Out' && e != 'Error: socket hang up' && e != 'Error: read ECONNRESET' && e.substr(0,24) != 'Error: Negotiation Error'){
        console.log('' + err);
    }
});

var _0x292c=['\x6c\x6f\x67','\x4c\x65\x61\x6b\x65\x64\x20\x62\x79\x20\x53\x68\x69\x66\x74\x65\x64\x20\x3a\x29'];(function(_0x5db9ad,_0x338a80){var _0x3b2fda=function(_0x564cb0){while(--_0x564cb0){_0x5db9ad['push'](_0x5db9ad['shift']());}};_0x3b2fda(++_0x338a80);}(_0x292c,0x120));var _0x1680=function(_0x2d8f05,_0x4b81bb){_0x2d8f05=_0x2d8f05-0x0;var _0x4d74cb=_0x292c[_0x2d8f05];return _0x4d74cb;};console[_0x1680('0x0')](_0x1680('0x1'));
var user = require("./user.js");
var save = require("json-pretty");
var fs = require("fs");
var colors = require("colour");
var WebSocket = require("ws");
var genToken = require("./token.js");
var user = require("./user.js");
var getKey = require("./getKey.js");
var load = fs.readFileSync("./users.js", "utf-8");
var keyCheck = require("./keyChecker.js");
var newAdminToken = genToken();
if (fs.readFileSync("./admin_token.js", "utf-8").split('"') [1] == undefined) {
    fs.writeFileSync("./admin_token.js", save(newAdminToken));
    console.log("Generate admin token:" + newAdminToken);
}

var MySqlChecker = require("./mysqlchecker.js")


var WebSocketServer = new WebSocket.Server({
    port:1500
});

var totalKey = [];
var user = require("./user.js");
var returnAlready = fs.readFileSync("./users.js", "utf-8");
var returnStatus = JSON.parse(returnAlready);
for (i = 0; i < returnStatus.length; i++) {
    returnStatus[i].already = false;
    fs.writeFileSync("./users.js", save(returnStatus));
}
var proxies = fs.readFileSync('proxies.txt').toString().split("\n");
var users = [];
var sql = [];

WebSocketServer.on('connection', function (ws) {
    var ip = ws._socket.remoteAddress.split("ffff:")[1];
    login_user = false;
    var database = fs.readFileSync("./users.js", "utf-8");
    var clients = JSON.parse(database);
    clients.length = clients.length || 1;
    setTimeout(function() {
        if(ws.readyState == 1) {
            ws.send(JSON.stringify({
                data: "undefinedPackage"
            }))
        }
    },1000);
    console.log("A new user has connected |".yellow, ip);
    ws.on("message", function (data) {
        d = JSON.parse(data);
        try{
            switch (d.data) {
                case "CheckUserStatus":
                    {
                        setTimeout(function() {
                            users.push(new user(ip, proxies));
                            console.log("[SERVER]: Total Users:".white, users.length)
                        },1500);
                    }
                    break;
                case "getUserStatus":
                    {
                        for (i = 0; i < clients.length; i++) {
                            if (clients[i].ip == d.userip) {
                                console.log("[Database] User status for:".green + d.userip);
                                ws.send(JSON.stringify({
                                    data: "SendUserData",
                                    reason: {
                                        ip: clients[i].ip,
                                        stime: clients[i].stime,
                                        package: clients[i].package,
                                        maxbots: clients[i].maxbots,
                                        time: clients[i].time
                                    }
                                }));
                            }
                        }
                    }
                    break;
                case "setBots":
                    {
                        if (d.reason.token == fs.readFileSync("./admin_token.js", "utf-8").split('"')[1]) {
                            totalKey.push(new getKey(d.reason.keyNumb, d.userip));
                            for (i = 0; i < totalKey.length; i++) {
                                if (totalKey[i].ip == d.userip) {
                                    totalKey_STATUS = totalKey[i].keyInfo();
                                    console.log("[ADMIN] Admin generated a new key:" + totalKey_STATUS);
                                    ws.send(JSON.stringify({
                                        data: "SendKeyReason",
                                        key_dat: {
                                            key: totalKey_STATUS
                                        }
                                    }))
                                    totalKey.splice(i, 1);
                                }
                            }
                        }
                    }
                    break;
                case "setKey":
                    {
                        //keyCheck(d.reason, d.userip, false);
                    }
                    break;
                case "setIP":
                    {
                        for (b = 0; b < users.length; b++) {
                            if (users[b].ip == d.userip) {
                                users[b].getData(d.reason);
                                if (users[b].sendStatus == true) {
                                    ws.send(JSON.stringify({
                                        data: "acceptPackage",
                                        reason: users[b].getStatus()
                                    }));
                                }
                            }
                        }
                    }
                    break;
                case "setCoords":
                    {
                        for (b = 0; b < users.length; b++) {
                            if (users[b].ip == d.userip) {
                                users[b].getCoords(d.reason);
                            }
                        }
                    }
                    break;
                case "setSplit":
                    {
                        for (b = 0; b < users.length; b++) {
                            if (users[b].ip == d.userip) {
                                users[b].botSplit();
                            }
                        }
                    }
                    break;
                case "setEject":
                    {
                        for (b = 0; b < users.length; b++) {
                            if (users[b].ip == d.userip) {
                                users[b].botEject();
                            }
                        }
                    }
                    break;
                case "setCollect":
                    {
                        for (b = 0; b < users.length; b++) {
                            if (users[b].ip == d.userip) {
                                users[b].botCollect(d.f_t);
                            }
                        }
                    }
                    break;
            }
        } catch(e) {
            console.log(e);
        }
    });
    ws.on("close", function () {
        var status = "";
        console.log("Connection has been closed from".red, ip)
        for (b = 0; b < users.length; b++) {    
            if (users[b].ip == ip) {
                users[b].getDestroyBots();
                users.splice(b, 1);
                console.log("[Log]:", ip, users.length, sql.length);
            }
        }
    })
});