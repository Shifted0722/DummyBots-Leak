"use strict";
process.setMaxListeners(0);
var Packet = require('./packet.js');
var WebSocket = require("ws");
var httpsagent = require("https-proxy-agent");
var Socks = require("socks");
var request = require('request');

function prepareData(a) {
	return new DataView(new ArrayBuffer(a));
}
class DataFrameWriter {
	constructor() {
		this.bytes = [];
	}
	writeUint8(val) {
		this.bytes.push(val);
	}
	writeUint16(val) {
		this.bytes.push(val & 0xFF);
		this.bytes.push(val >> 8 & 0xFF);
	}
	writeUint32(val) {
		this.bytes.push(val & 0xFF);
		this.bytes.push(val >> 8 & 0xFF);
		this.bytes.push(val >> 16 & 0xFF);
		this.bytes.push(val >> 24 & 0xFF);
	}
	writeStringEx(str) {
		this.writeUint16(str.length);
		for (var i = 0; i < str.length; i++) {
			this.writeUint16(str.charCodeAt(i));
		}
	}
	getBuffer() {
		return this.bytes;
	}
	getArrayBuffer() {
		return new Uint8Array(this.bytes).buffer;
	}
}
var simbol = [""];

module.exports = class Client {
	constructor(id, proxy, origin, packet) {
		var client = this;
		client.id = id;
		client.package = packet;
		client.proxy = proxy;
		client.ws = null;
		client.agent = new httpsagent("http://" + client.proxy);
		client.canSpawn = true;
		client.close = false;
		client.origin = origin ? origin : null;
		client.ping_s = null;
		client.ping_e = null;
		client.minX = 0;
		client.minY = 0;
		client.maxX = 0;
		client.maxY = 0;
		client.offsetX = 0;
		client.offsetY = 0;
		client.x = 0;
		client.simbol = simbol[Math.floor(Math.random() * simbol.length)];
		client.y = 0;
		client.cookie = "";
		client.headers = {
			'Origin': client.origin,
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.89 Safari/537.35',
		};
		client.c_headers = {
			"Accept-Encoding": "gzip, deflate",
			"Accept-Language": "pl-PL,pl;q=0.8,en-US;q=0.6,en;q=0.4",
			"Cache-Control": "no-cache",
			"Cookie": "__cfduid=df2db54a70c595c3c2b5a0d067d1650481506608598",
			"Origin": client.origin,
			"Pragma": "no-cache",
			"Sec-WebSocket-Extensions": "permessage-deflate; client_max_window_bits",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
		};
		if (client.origin === "http://alis.io" || client.origin === "http://nbk.io" || client.origin === "http://mgar.io" || client.origin === "http://gaver.io") {
			client.headers = client.c_headers;
		}
		if (client.origin === "http://cellcraft.io" || client.origin === "http://agar.red" || client.origin === "http://agariocity.pro") {
			client.header = client.c_headers;
			client.header['Accept-Encoding'] = "gzip, deflate";
			client.header['Accept-Language'] = "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7";
			client.header['Cache-Control'] = "no-cache";
			client.header['Pragma'] = "no-cache";
			client.header['Sec-WebSocket-Extensions'] = "permessage-deflate; client_max_window_bits";
			client.header['Referer'] = client.origin;
		}
		this.valid_player_pos = {
			"suicide_targets": [-7071, -7071, 7071, 7071]
		}
		client.onTouchCollectPellets = false;
		this.ball_id = null;
		this.balls = {};
		this.tick_counter = 0; //number of ticks (packet ID 16 counter)
		this.inactive_interval = 0; //ID of setInterval()
		this.my_balls = []; //IDs of my balls
		this.score = 0; //my score
		this.leaders = []; //IDs of leaders in FFA mode
		this.teams_scores = []; //scores of teams in Teams mode
		this.auth_token = ''; //auth token. Check README.md for how to get it
		this.auth_provider = 1; //auth provider. 1 = facebook, 2 = google
		this.spawn_attempt = 0; //attempt to spawn
		this.spawn_interval_id = 150; //ID of setInterval()
		this.cellX = 0;
		this.cellY = 0;

		this._pellets = [];
		this.ball = null;

	}
	connect(ip) {
		var client = this;
		client.headers = {
			'Origin': client.origin,
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.89 Safari/537.35',
		};
		client.c_headers = {
			"Accept-Encoding": "gzip, deflate",
			"Accept-Language": "pl-PL,pl;q=0.8,en-US;q=0.6,en;q=0.4",
			"Cache-Control": "no-cache",
			"Cookie": "__cfduid=df2db54a70c595c3c2b5a0d067d1650481506608598",
			"Origin": client.origin,
			"Pragma": "no-cache",
			"Sec-WebSocket-Extensions": "permessage-deflate; client_max_window_bits",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
		};
		if (client.origin === "http://alis.io" || client.origin === "http://nbk.io" || client.origin === "http://mgar.io" || client.origin === "http://gaver.io" || client.origin === "http://neyagar.ga") {
			client.headers = client.c_headers;
		}
		if (client.origin === "http://cellcraft.io" || client.origin === "http://agar.red" || client.origin === "http://agariocity.pro") {
			client.header = client.c_headers;
			client.header['Accept-Encoding'] = "gzip, deflate";
			client.header['Accept-Language'] = "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7";
			client.header['Cache-Control'] = "no-cache";
			client.header['Pragma'] = "no-cache";
			client.header['Sec-WebSocket-Extensions'] = "permessage-deflate; client_max_window_bits";
			client.header['Referer'] = client.origin;
		}
		client.server = ip;
		//if(typeof ip !== String || typeof ip !== "String") ip = "127.0.0.1:443"
		client.ws = null;
		if (client.origin != null) {
			client.ws = null;
			var config = {
				protocolVersion: 13,
				agent: client.agent,
				origin: client.origin,
				headers: client.c_headers,
				timeout: 0
			};
			client.ws = new WebSocket(ip, config);
		}
		this.ws.binaryType = "arraybuffer";
		client.ws.onopen = function() {
			if (!client.ws || client.ws.readyState !== WebSocket.OPEN) {
				return;
			}
			//console.log("bot count", me.user_count, "bot max", me.user_max)
			//console.log("LOL")
			if (client.origin === "http://gaver.io") {
				client.ws.send(new Uint8Array([254, 5, 0, 0, 0]));
				client.ws.send(new Uint8Array([255, 35, 18, 56, 9]));
			}
			if (client.origin === "http://agariomachos.com") { // beta
				client.ws.send(new Uint8Array([0, 254, 1, 28, 0]));
				client.ws.send(new Uint8Array([0, 255, 16, 128, 33]));
			}
			if (client.origin === "http://zagar.io") {
				client.ws.send(new Uint8Array([254, 5, 0, 0, 0]));
				client.ws.send(new Uint8Array([255, 0, 0, 0, 0]));
				client.ws.send(new Uint8Array([19]));
			}
			if (client.origin === "http://galx.io") {
				client.ws.send(new Buffer([254, 5, 0, 0, 0]));
				client.ws.send(new Buffer([255, 166, 126, 112, 79]));
				client.ws.send(new Buffer([43]));
				client.ws.send(new Buffer([43]));
				client.ws.send(new Buffer([46]));
				client.ws.send(new Buffer([45]));
			}
			if (client.origin === "http://bubla.io") {
				client.ws.send(new Buffer([254, 5, 0, 0, 0]));
				client.ws.send(new Buffer([255, 166, 126, 112, 79]));
				client.ws.send(new Buffer([43]));
				client.ws.send(new Buffer([43]));
				client.ws.send(new Buffer([46]));
				client.ws.send(new Buffer([45]));
			}
			if (client.origin === "http://agar.red") {
				client.ws.send(new Uint8Array([254, 5, 0, 0, 0]));
				client.ws.send(new Uint8Array([255, 1, 0, 0, 0]));
			}
			if (client.origin === "http://cellcraft.io") {
				client.ws.send(new Uint8Array([254, 5, 0, 0, 0]));
				client.ws.send(new Uint8Array([255, 50, 137, 112, 79]));
				client.ws.send(new Uint8Array([90, 51, 24, 34, 131]));
				client.ws.send(new Uint8Array([42]));
			}
			if (client.origin === "http://agariox.net") {
				client.ws.send(new Uint8Array([254, 5, 0, 0, 0]));
				client.ws.send(new Uint8Array([255, 21, 205, 91, 7]));
			}
			if (client.origin === "http://dual-agar.online") {
				client.ws.send(this.ws, new Buffer([252, 10, 0, 111, 0, 110, 0, 120, 0, 99, 0, 110, 0, 107, 0, 95, 0, 49, 0, 48, 0, 49, 0, 5, 0, 37, 0, 90, 0, 75, 0, 77, 0, 114, 0]));
				let buf = new DataFrameWriter();
				buf.writeUint8(30);
				buf.writeStringEx("dummybots.cf");
				buf.writeStringEx(""); // team
				buf.writeStringEx(""); // skin
				buf.writeStringEx(""); // code
				buf.writeStringEx("");
				client.ws.send(new Buffer(buf.getBuffer()));
			}
			if (client.origin === "http://agar.pro") {
				client.ws.send(new Uint8Array([254, 5, 0, 0, 0]));
				client.ws.send(new Uint8Array([255, 166, 126, 112, 79]));
				setInterval(function() {
					if (client.ws.readyState == 1) {
						client.ws.send(new Uint8Array([31]));
					}
				}.bind(client), 500);
			}
			if (client.origin === "http://agariocity.pro") {
				client.ws.send(new Uint8Array([254, 5, 0, 0, 0]));
				client.ws.send(new Uint8Array([255, 166, 126, 112, 79]));
				setInterval(function() {
					if (client.ws.readyState == 1) {
						client.ws.send(new Uint8Array([31]));
					}
				}.bind(client), 500);
			}
			if (client.origin === "http://agarioforums.io") {
				client.ws.send(new Uint8Array([254, 5, 0, 0, 0]));
				client.ws.send(new Uint8Array([255, 166, 126, 112, 79]));
				setInterval(function() {
					if (client.ws.readyState == 1) {
						client.ws.send(new Uint8Array([31]));
					}
				}.bind(client), 500);
			}
			client.spawn("leaked by shifted" + client.simbol);
			setInterval(function() {
                client.spawn("leaked by shifted" + client.simbol);
			}.bind(client), 3600);
            client.sendChat(""); 
			setInterval(function() {
                client.sendChat(""); 
			}.bind(client), 60000);
		}
		client.ws.onclose = function(e) {
			//console.log(e.code, " || ", e.reason); // log disconnect reason & code
			client.close = true;
		}
		client.ws.onerror = function(e) {}
		client.ws.onmessage = function(e) {
			var msg = new Buffer(e.data);
			//-----CLONS-PROTOCOL-VERSION-V1-----\\
			var packet = new Packet(e);
			var packet_id = packet.readUInt8();
			if(client.origin == "http://agar.pro" || client.origin == "http://agar.red" || client.origin == "http://agariocity.pro") {
				try {
					client.process_attach_server(packet_id, this, packet);
				} catch (e) {
					//console.log(e)
				}
			}
			if (client.origin == "http://agar.pro" || client.origin == "http://agariocity.pro") {
				var offset = 0;
				if (msg.readUInt8(offset) == 64 && msg.byteLength == 33) {
					offset += 1;
					client.minX = msg.readDoubleLE(offset);
					offset += 8;
					client.minY = msg.readDoubleLE(offset);
					offset += 8;
					client.maxX = msg.readDoubleLE(offset);
					offset += 8;
					client.maxY = msg.readDoubleLE(offset);
					client.offsetX = (client.minX + client.maxX) / 2;
					client.offsetY = (client.minY + client.maxY) / 2;
				}
			}
		}
	}
	spawn(name) {
		var client = this;
		if (!client.ws || client.ws.readyState !== WebSocket.OPEN) {
			client.canSpawn = false;
			return;
		}
		if (client.origin === "http://dual-agar.online") {
			client.ws.send(new Buffer([130]));
			client.ws.send(new Buffer([31]));
		}
		if (client.origin === "http://germs.io") {
			client.ws.send(new Uint8Array([0, 83, 0, 105, 0, 122, 0, 82, 0, 101, 0, 120, 0]));
		}
		if (client.origin == "http://cellcraft.io") {
			var buf = new Buffer(3 + 2 * name.length);
			buf.writeUInt8(0, 0);
			buf.writeUInt16LE(59, 1);
			for (let i = 0; i < name.length; i++) buf.writeUInt16LE(name.charCodeAt(i), 3 + 2 * i);
		} else {
			var buf = new Buffer(1 + 2 * name.length);
			buf.writeUInt8(0, 0);
			//buf.writeUInt16LE(59, 1);
			for (let i = 0; i < name.length; i++) buf.writeUInt16LE(name.charCodeAt(i), 1 + 2 * i);
		}
		this.ws.send(buf)
		client.canSpawn = true;
	}
	//-----CLONS-PROTOCOL-VERSION-V1-----\\
	process_attach_server(pack_id, client, packet) {
		var client = this;
		if(client.origin == "http://dual-agar.online") return
		if (pack_id == '16') {
			var eaters_count = packet.readUInt16LE();
			client.tick_counter++;
			for (var i = 0; i < eaters_count; i++) {
				var eater_id = packet.readUInt32LE();
				var eaten_id = packet.readUInt32LE();
				//console.log(eater_id + ' ate ' + eaten_id + ' (' + client.balls[eater_id] + '>' + client.balls[eaten_id] + ')');
			}
			while (1) {
				var is_virus = false;
				var ball_id;
				var coordinate_x;
				var coordinate_y;
				var size;
				var color;
				var nick = null;
				ball_id = packet.readUInt32LE();
				if (ball_id == 0) break;
				coordinate_x = packet.readSInt32LE();
				coordinate_y = packet.readSInt32LE();
				size = packet.readSInt16LE();
				var color_R = packet.readUInt8();
				var color_G = packet.readUInt8();
				var color_B = packet.readUInt8();
				color = (color_R << 16 | color_G << 8 | color_B).toString(16);
				color = '#' + ('000000' + color).substr(-6);
				var opt = packet.readUInt8();
				is_virus = !!(opt & 1);
				var something_1 = !!(opt & 16);
				if (opt & 2) {
					packet.offset += packet.readUInt32LE();
				}
				if (opt & 4) {
					var something_2 = '';
					while (1) {
						var char = packet.readUInt8();
						if (char == 0) break;
						if (!something_2) something_2 = '';
						something_2 += String.fromCharCode(char);
					}
				}
				while (1) {
					char = packet.readUInt16LE();
					if (char == 0) break;
					if (!nick) nick = '';
					nick += String.fromCharCode(char);
				}
				this.ball = new Ball(client, ball_id);
				this.ball.color = color;
				this.ball.virus = is_virus;
				//console.log(this.ball.color)
				this.ball.setCords(coordinate_x, coordinate_y);
				this.ball.setSize(size);
				if (nick) this.ball.setName(nick);
				this.ball.update_tick = client.tick_counter;
				this.ball.appear();
				this.ball.update();
				if (this.ball.virus == true) {
					this.cellX = this.ball.x;
					this.cellY = this.ball.y;
				}
				if(this.ball.virus == false) {
					if(this.ball.size < 40) {
						this.cellX = this.ball.x;
						this.cellY = this.ball.y;
					}
				}
			}
			var balls_on_screen_count = packet.readUInt32LE();
			for (i = 0; i < balls_on_screen_count; i++) {
				ball_id = packet.readUInt32LE();
				this.ball = new Ball(client, ball_id);
				if (this.ball.mine) {
					this.ball.destroy({
						reason: 'merge'
					});
					client.emitEvent('merge', this.ball.id);
				} else {
					this.ball.disappear();
					this.ball.update_tick = client.tick_counter;
					this.ball.update();
				}
			}
		}
	}
	//-----CLONS-PROTOCOL-VERSION-V1-----\\
	calculateTarget() {
		for(var i in this._pellets) {
			if(this._pellets[i] != undefined) {
				let cell = this._pellets[i];
				this.cellX = this._pellets[0].x;
				this.cellY = this._pellets[0].y;
				//console.log(this._pellets[i])
			}
		}
	}
	setPos(x, y, mode) {
		//console.log(x, y)
		var client = this;
		client.x = x;
		client.y = y;
		if (mode == "Mouse") {
			client.moveTo(client.x + client.offsetX, client.y + client.offsetY);
		} else if (mode == "Collect") {
			client.moveTo(this.cellX, this.cellY);
		}
	}
	moveTo(x, y) {
		var client = this;
		if (!client.ws || client.ws.readyState !== WebSocket.OPEN) {
			client.canSpawn = false;
			return;
		}
		var x = x,
			y = y;
		if (client.origin === "http://agar.pro" || client.origin == "http://play.agario0.com" || client.origin == "http://agar.bio") {
			let buf = new Buffer(21);
			buf.writeUInt8(16, 0);
			buf.writeDoubleLE(x, 1);
			buf.writeDoubleLE(y, 9);
			buf.writeUInt32LE(0, 17);
			client.ws.send(buf);
		}
		if(client.origin === "http://neyagar.ga") {
			var buf = new Buffer(13);
			buf.writeUInt8(16, 0);
			buf.writeInt32LE(x, 1);
			buf.writeInt32LE(y, 5);
			buf.writeUInt32LE(0, 9);
			client.ws.send(buf);
		}
		var buf = new Buffer(13);
		buf.writeUInt8(16, 0);
		buf.writeInt32LE(x, 1);
		buf.writeInt32LE(y, 5);
		buf.writeUInt32LE(0, 9);
		client.ws.send(buf);
	}
	collect(collecttrue) {
		if (collecttrue == true) {
			this.onTouchCollectPellets = true;
		} else if (collecttrue == false) {
			this.onTouchCollectPellets = false;
		}
	}
	split() {
		var client = this;
		if (!client.ws || client.ws.readyState !== WebSocket.OPEN) {
			return;
		}
		var buf = new Buffer([17]);
		client.ws.send(buf);
		if (client.origin === "http://mgar.io") {
			var buf = new Buffer([56]);
			client.ws.send(buf);
		}
		if (client.origin == "http://gaver.io") {
			client.ws.send(new Uint8Array([69, 1]));
		}
	}
	sendChat(data) {
		var client = this;
		if (!client.ws || client.ws.readyState !== WebSocket.OPEN) {
			return;
		}
		var buf = new Buffer(2 + 2 * data.length);
		buf.writeUInt16LE(99, 0);
		if (client.origin === "http://gota.io") {
			buf.writeUInt16LE(72, 0);
		}
		for (var i = 0; i < data.length; i++) {
			buf.writeUInt16LE(data.charCodeAt(i), 2 + i * 2);
		}
		client.ws.send(buf)
	}
	eject() {
		var client = this;
		if (!client.ws || client.ws.readyState !== WebSocket.OPEN) {
			return;
		}
		var buf = new Buffer([22]);
		if (client.origin === "http://mgar.io") {
			var buf = new Buffer([57]);
			client.ws.send(buf);
		}
		if (client.origin === "http://alis.io") {
			var buf = new Buffer([21]);
			client.ws.send(buf);
		}
		if (client.origin === "http://gaver.io") {
			var buf = new Buffer([21]);
			client.ws.send(buf);
			client.ws.send(new Uint8Array([69, 2]));
		}
		if (client.origin === "http://agar.pro") {
			var buf = new Buffer([21]);
			client.ws.send(buf);
		}
		if (client.origin === "http://agarioforums.io") {
			var buf = new Buffer([21]);
			client.ws.send(buf);
		}
		if (client.origin === "http://agar.bio") {
			var buf = new Buffer([21]);
			client.ws.send(buf);
		}
		if (client.origin === "http://agar.red") {
			var buf = new Buffer([21]);
			client.ws.send(buf);
		}
		if (client.origin === "http://dual-agar.online") {
			var buf = new Buffer([21]);
			client.ws.send(buf);
		}
		client.ws.send(buf);
	}
	getCookie(data) {
		var client = this;
		request({
			url: client.origin,
			agent: client.agent,
			headers: {
				'Accept-': 'pl-PL,pl;q=0.8,en-US;q=0.6,en;q=0.4',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)  Chrome/55.0.2883.89 Safari/537.35',
				'Accept-Encoding': 'gzip, deflate, sdch'
			}
		}, function(error, response, body) {
			if (!error && response.headers["set-cookie"]) {
				client.headers['cookie'] = response.headers["set-cookie"];
			}
		}).on('timeout', (e) => {});
	}
};

function Ball(client, id) {
	this.id = id;
	this.name = null;
	this.x = 0;
	this.y = 0;
	this.size = 0;
	this.mass = 0;
	this.food = false;
	this.virus = false;
	this.mine = false;
	this.client = client;
	this.destroyed = false;
	this.visible = false;
	this.last_update = (+new Date);
	this.update_tick = 0;
	return this;
}
Ball.prototype = {
	destroy: function(reason) {
		this.destroyed = reason;
		var mine_ball_index = this.client.my_balls.indexOf(this.id);
		if (mine_ball_index > -1) {}
		this.emitEvent('destroy', reason);
	},
	setCords: function(new_x, new_y) {
		if (this.x == new_x && this.y == new_y) return;
		var old_x = this.x;
		var old_y = this.y;
		this.x = new_x;
		this.y = new_y;
		if (!old_x && !old_y) return;
		this.emitEvent('move', old_x, old_y, new_x, new_y);
	},
	setSize: function(new_size) {
		if (this.size == new_size) return;
		var old_size = this.size;
		this.size = new_size;
		this.mass = parseInt(Math.pow(new_size / 10, 2));
		if (!old_size) return;
		this.emitEvent('resize', old_size, new_size);
		if (this.mine) this.client.updateScore();
	},
	setName: function(name) {
		if (this.name == name) return;
		var old_name = this.name;
		this.name = name;
		this.emitEvent('rename', old_name, name);
	},
	isMyFriend: function() { //adding this.ball.isMyFriend() function
		return this.is_friend == true; //if this.ball is_friend is true, then true will be returned
	},
	update: function() {
		var old_time = this.last_update;
		this.last_update = (+new Date);
		this.emitEvent('update', old_time, this.last_update);
	},
	appear: function() {
		if (this.visible) return;
		this.visible = true;
		this.emitEvent('appear');
		if (this.mine) this.client.updateScore();
	},
	disappear: function() {
		if (!this.visible) return;
		this.visible = false;
		this.emitEvent('disappear');
	},
	toString: function() {
		if (this.name) return this.id + '(' + this.name + ')';
		return this.id.toString();
	},
	emitEvent: function() {
		var args = [];
		for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
	}
};
