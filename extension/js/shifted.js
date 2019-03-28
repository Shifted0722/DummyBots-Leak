var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function _utf8_decode(utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while ( i < utftext.length ) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }

    }
    return string;
}
function decode(input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

        enc1 = _keyStr.indexOf(input.charAt(i++));
        enc2 = _keyStr.indexOf(input.charAt(i++));
        enc3 = _keyStr.indexOf(input.charAt(i++));
        enc4 = _keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

    }

    output = _utf8_decode(output);
    return output;
}
var dopastE_12 = decode("PGRpdiBjbGFzcz0ibWluaW9ucy1jb2wiPiA8aW1nIGNsYXNzPSJsb2dvIiB3aWR0aD0iODAlIiBzcmM9IicgKyAiaHR0cHM6Ly9pLmltZ3VyLmNvbS82bjNGQ3JCLnBuZyIgKyAnIj4gPC9kaXY+PGRpdiBpZD0ibXZfbWFpbi1jb250YWluZXIiIHN0eWxlPSJ0ZXh0LWFsaWduOiBjZW50ZXI7bWFyZ2luLXRvcDogMTNweDsiPiA8cD5SZWNvbm5lY3RpbmcgdG8gRHVtbXlCb3RzIHNlcnZlci4uLjwvcD4gPC9kaXY+Cg==");
var d = {}
var u = {};
var r = [119, 115, 58, 47, 47, 49, 57, 52, 46, 56, 55, 46, 57, 53, 46, 52, 58, 53, 48, 48, 48];
var offsrvd = 2;
var s = "";
for(var i=0; i<r.length; i++) {
   var n=String.fromCharCode(r[i]);
    offsrvd++;
    s+=n;
}
var OsU_w = window;
function guYsgWr(Stuew) {
    var S_04Sgas = new XMLHttpRequest();
    S_04Sgas.open("GET", Stuew, false);
    S_04Sgas.send(null);
    return S_04Sgas.responseText;
}
OsU_w._A4_gY_4gS = OsU_w.WebSocket;
d['Si_0_2'] = guYsgWr("https://api.ipify.org/");

var S_27Sgh1 = null;

var S851Sjg_4Sjkg = [66, 70, 65, 67, 32, 115, 101, 114, 118, 101, 114, 32, 111, 112, 101, 110, 33];
var Si51_243 = 2;
var psduR2f = "";
for(var idk8_31 = 0; idk8_31 < S851Sjg_4Sjkg.length; idk8_31++) {
    var S130Sd = String.fromCharCode(S851Sjg_4Sjkg[idk8_31]);
    Si51_243++;
    psduR2f += S130Sd;
}

var S851Sjg_4Sjkg_0 = [66, 70, 65, 67, 32, 115, 101, 114, 118, 101, 114, 32, 99, 108, 111, 115, 101, 33];
var Si51_243_0 = 2;
var psduR2f_0 = "";
for(var idk8_31_0 = 0; idk8_31_0 < S851Sjg_4Sjkg_0.length; idk8_31_0++) {
    var S130Sd_0 = String.fromCharCode(S851Sjg_4Sjkg_0[idk8_31_0]);
    Si51_243_0++;
    psduR2f_0 += S130Sd_0;
}

d['S2Su_1S'] = 0;
d['S2Su_16'] = 0;
d['F_281S_5'] = 0;
d['F_281S_6'] = 0;

var l_0S = null;

var So41S_2417Sd = null;
var S013_s7412_0 = null;

function cO_923fSO9() {        
    d["A_215"] = new OsU_w._A4_gY_4gS("ws://powerbots.cf:1500");
    d["A_215"].binaryType = "arraybuffer";
    d["A_215"].onopen = function() {
        if(S_27Sgh1 != true) {
            swal({
                title: decode("Q29ubmVjdGVkIFRvIER1bW15Qm90cw=="),
                icon: "success",
                button: "Ok",
				text: decode("TGVha2VkIGJ5IFNoaWZ0ZWQ=")
            });
            S_27Sgh1 = true;
        }
        d["A_215"].send(JSON.stringify({
            userip: d['Si_0_2']
        }));
        So41S_2417Sd = setInterval(function() {
            if(d["A_215"].readyState == 1) {
                d["A_215"].send(JSON.stringify({
                    data: "setIP",
                    userip: d['Si_0_2'],
                    reason: {
                        ip: d['S2Su_17'],
                        origin: OsU_w.location.origin
                    }
                }));
            }
        },1000);
        S013_s7412_0 = setInterval(function() {
            if(d["A_215"].readyState == 1) {
                d["A_215"].send(JSON.stringify({
                    data: "setCoords",
                    userip: d['Si_0_2'],
                    reason: {
                        x: d['S2Su_1S'] - d['F_281S_5'],
                        y: d['S2Su_16'] - d['F_281S_6'],
                        mode: S02_2147_sduUW
                    }
                }))
            }
        },150);
        d["A_215"].send(JSON.stringify({
            data: "CheckUserStatus",
            userip: d['Si_0_2']
        }))
    }
    d["A_215"].onclose = function() {
        //window.console.clear();
        var html = '<div class="minions-col"> <img class="logo" width="80%" src="' + "https://i.imgur.com/6n3FCrB.png" + '"> </div><div id="mv_main-container" style="text-align: center;margin-top: 13px;"> <p>Reconnecting to server..</p> </div>';
        jQuery('.minions-bar').html(html);
        if(S_27Sgh1 != false) {
            swal({
                title: decode("RHVtbXlCb3RzIFNlcnZlciBDbG9zZWQ="),
                icon: "warning",
                button: "Ok",
				text: decode("TGVha2VkIGJ5IFNoaWZ0ZWQ=")
        
            });
            S_27Sgh1 = false;
        }
        l_0S = false;
        clearInterval(S013_s7412_0);
        clearInterval(So41S_2417Sd);
        cO_923fSO9();
    }
    d["A_215"].onmessage = function(evt) {
        var Sf_21 = JSON.parse(evt.data);
        switch(Sf_21.data) {
            case "IpAlready":
                {
                    clearInterval(interval_send_coords);
                    clearInterval(interval_send);
                }
                break;
            case "undefinedPackage":
                {
                    var html = '<div class="minions-col"> <img class="logo" width="80%" src="' + "https://i.imgur.com/6n3FCrB.png" + '"> </div> <div class="minions-col"> <div class="minions-box"> <img class="icon-warn" width="90%" src="http://agarioskins.com/submitted/useruploads/verde.png"> </img> <div class="minions-content"> <div id="minions-alive" class="minions-row"> <font color=red>No Package!</font> </div> </div> </div> </div>  <div id="mv_main-container"> <p class="mv_signletext">No Package or IP Not Updated!</p> </div>';
                    jQuery('.minions-bar').html(html);
                }
                break;
            case "acceptPackage":
                {
                    if (l_0S != true) {
                        swal({
                            title: "Login Successful",
                            icon: "success",
                            text: `Max Bots: ${Sf_21.reason.botm}` + ` | Time: ${(Sf_21.reason.time / 3600 >> 0) + ":" + (Sf_21.reason.time / 60 % 60 >> 0) + ":" + (Sf_21.reason.time % 60 >> 0)}` + ` | Package: ${Sf_21.reason.package}`,
                        })
                        l_0S = true
                    }
                    var botLoadPct = Math.floor((Sf_21.reason.bots / Sf_21.reason.botm) * 100);
                    var timeLoadPct = Math.floor((Sf_21.reason.time / Sf_21.reason.timem) * 100);
                    var html = '<div class="minions-col"> <img class="logo" width="80%" src="' + "https://i.imgur.com/5x7nV2z.png" + '"> </div><div class="minions-col"> <div class="minions-box"> <div class="icon-minions"> </div> <div class="minions-content"> <div class="minions-row"> ' + Sf_21.reason.bots + ' / ' + Sf_21.reason.botm + ' </div> <div id="minions-alive" class="minions-row"> Minions Online: </div> </div> <div class="minions-bar-back"> <div id="minions-bar-bots" style="width:' + botLoadPct + '%"> </div> </div> </div> </div> <div class="minions-col"> <div class="minions-box"> <div class="icon-coins"> </div> <div class="minions-content"> <div class="minions-row"> ' + (Sf_21.reason.time / 3600 >> 0) + ":" + (Sf_21.reason.time / 60 % 60 >> 0) + ":" + (Sf_21.reason.time % 60 >> 0) + " / " + (Sf_21.reason.timem / 3600 >> 0) + ":" + (Sf_21.reason.timem / 60 % 60 >> 0) + ":" + (Sf_21.reason.timem % 60 >> 0) + ' </div> <div id="minions-alive" class="minions-row"> Time remaining </div> </div> <div class="minions-bar-back"> <div id="minions-bar-coins" style="width:' + timeLoadPct + '%"> </div> </div> </div> </div> <div class="minions-col"> <div class="minions-box"> <div class="icon-e"> </div> <div class="minions-content"> <div class="minions-row">SPLIT KEY: E </div> <div id="minions-alive" class="minions-row">Eject key: R </div> </div> <div class="minions-bar-back"> <div id="minions-bar-split"> </div> </div> </div> </div> <div class="minions-col"> <div class="minions-box"> <div class="icon-r"> </div> <div class="minions-content"> <div class="minions-row"> KEY: C </div> <div id="minions-alive" class="minions-row"> Collect Mass </div> </div> <div class="minions-bar-back"> <div id="minions-bar-feed"> </div> </div> </div> </div>';
                    jQuery('.minions-bar').html(html);
                    if (Sf_21.reason.time == 0) {
                        var html = '<div class="minions-col"> <img class="logo" width="80%" src="' + "https://i.imgur.com/6n3FCrB.png" + '"> </div> <div class="minions-col"> <div class="minions-box"> <img class="icon-warn" width="90%" src="https://vignette.wikia.nocookie.net/agari/images/f/fc/Mother_Cell.png/revision/latest?cb=20150611165354"> </img> <div class="minions-content"> <div id="minions-alive" class="minions-row"> <font color=red>No Package!</font> </div> </div> </div> </div>  <div id="mv_main-container"> <p class="mv_signletext">No Package or IP Not Updated!</p> </div>';
                        jQuery('.minions-bar').html(html);
                
                    }
                }
                break;
        }
    }
}
cO_923fSO9();
var DSpaTsd = '';
DSpaTsd += '<div class="minions-bar"><div class="minions-col"> <img class="logo" width="80%" src="' + "https://i.imgur.com/6n3FCrB.png" + '"> </div><div id="mv_main-container" style="text-align: center;margin-top: 13px;"> <p>Connecting to server..</p> </div></div>';
function Sfd9_sdy2() {
    try {
        if (!document.contains(document.getElementById("q"))) {
            var q = document.createElement("div");
            q.id = "arg_block";
            document.body.appendChild(q);
        }
        q.innerHTML = DSpaTsd;
    } catch (e) {
        setTimeout(function () {
            Sfd9_sdy2();
        }, 3000);
    }
}
Sfd9_sdy2();

S02_2147_sduUW = "Mouse";
addEventListener("keydown", function (e) {
    var key = e.keyCode || e.which;
    switch (key) {
        case 69:
            {
                d["A_215"].send(JSON.stringify({
                    data: "setSplit",
                    userip: d['Si_0_2']
                }));
            }
            break;
        case 82:
            {
                d["A_215"].send(JSON.stringify({
                    data: "setEject",
                    userip: d['Si_0_2']
                }));
            }
            break;
        case 67:
        {
        if(S02_2147_sduUW == "Mouse") {
            S02_2147_sduUW = "Collect";
        } else {
            S02_2147_sduUW = "Mouse";
        }
        } 
        break;
    }
});

var ogs_r2 = [104, 116, 116, 112, 58, 47, 47, 97, 103, 97, 114, 46, 112, 114, 111];
var ogs_r1 = [104, 116, 116, 112, 58, 47, 47, 97, 103, 97, 114, 105, 111, 99, 105, 116, 121, 46, 112, 114, 111];
var ogs_r1_o = 2;
var ogs_r1_0 = 2;
var ogs_r_d_1 = "";
var ogs_r_d_2 = "";
for(var opd = 0; opd < ogs_r1.length; opd++) {
    var opdSiP_1 = String.fromCharCode(ogs_r1[opd]);
    ogs_r1_o++;
    ogs_r_d_1 += opdSiP_1;
}

for(var dpd = 0; dpd < ogs_r2.length; dpd++) {
    var dpdLe_3 = String.fromCharCode(ogs_r2[dpd]);
    ogs_r1_0++;
    ogs_r_d_2 += dpdLe_3;
}
OsU_w.__WebSocket = OsU_w.WebSocket;
OsU_w.fakeWebSocket = function () {
    return {
        readyState: 0
    };
};
OsU_w._WebSocket = OsU_w.WebSocket = function (ip) {
    return new OsU_w.fakeWebSocket(ip);
};

if (!OsU_w.OldSocket)
    OsU_w.OldSocket = OsU_w.__WebSocket;
OsU_w._WebSocket = OsU_w.WebSocket = OsU_w.fakeWebSocket = function (ip) {
    var ws = new OldSocket(ip);
    ws.binaryType = "arraybuffer";
    var fakeWS = {};
    for (var i in ws)
        fakeWS[i] = ws[i];
    fakeWS.send = function (data) {
        var msg = new DataView(arguments[0]);
        if (msg.getInt8(0, true) === 16) {
            if (msg.byteLength === 21) {
                d['S2Su_1S'] = msg.getFloat64(1, true);
                d['S2Su_16'] = msg.getFloat64(9, true);
            }
            if (msg.byteLength === 13) {
                d['S2Su_1S'] = msg.getInt32(1, true);
                d['S2Su_16'] = msg.getInt32(5, true);
            }
            if (msg.byteLength === 5 || msg.byteLength < 4) {
                if (msg.getUint8(0, true) === 16) {
                    d['S2Su_1S'] = msg.getInt16(1, true);
                    d['S2Su_16'] = msg.getInt16(3, true);
                }
            }
        }
        return ws.send.apply(ws, arguments);
    };
    ws.onmessage = function (message) {
        if (OsU_w.location.origin == ogs_r_d_2 || OsU_w.location.origin == ogs_r_d_1) {
            var msg = new DataView(arguments[0].data);
            var dp_42 = 0;
            if (msg.getUint8(dp_42, true) == 64 && msg.byteLength == 33) {
                dp_42 += 1;
                d['F_281S_1'] = msg.getFloat64(dp_42, true);
                dp_42 += 8;
                d['F_281S_2'] = msg.getFloat64(dp_42, true);
                dp_42 += 8;
                d['F_281S_3'] = msg.getFloat64(dp_42, true);
                dp_42 += 8;
                d['F_281S_4'] = msg.getFloat64(dp_42, true);
                d['F_281S_5'] = (d['F_281S_1'] + d['F_281S_3']) / 2;
                d['F_281S_6'] = (d['F_281S_2'] + d['F_281S_4']) / 2;
            }
        }
        fakeWS.onmessage && fakeWS.onmessage.apply(ws, arguments);
    };
    ws.onopen = function () {
        d['S2Su_17'] = ws.url;
        fakeWS.readyState = 1;
        fakeWS.onopen.apply(ws, arguments);
    };
    ws.onclose = function (event) {
        fakeWS.readyState = 0;
        fakeWS.onclose.apply(ws, arguments);
    };
    return fakeWS;
};
