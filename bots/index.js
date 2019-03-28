var WebSocket = require('ws');
var socks = require('socks');
var fs = require('fs');
var socket = require('socket.io')(8081);

let botsNick = "leaked by shifted";
let server = "";
let maxBots = 350;
let Origin = "";
let bots = [];
let proxies = fs.readFileSync('proxies.txt', 'utf-8').split('\n');

socket.on('connection', socket => {
	console.log('A user has connected!');
	socket.on('start', data => {
		server = data.ip;
		Origin = data.origin;
		console.log(`Origin: ${Origin} | Server: ${server}`);
		for(var i = 0; i < maxBots; i++) bots.push(new Bot(i));
	});
	socket.on('moveTo', data => {
		for(const bot of bots) bot.moveTo(data.x, data.y);
	});
	socket.on('split', () => {
		for(var i in bots) bots[i].split();
	});
	socket.on('eject', () => {
		for(var i in bots) bots[i].eject();
	});
});

function agent(id) {
	var proxy = proxies[id].split(':');
	if (!proxy) return undefined;
	return new socks.Agent({
		proxy: {
			ipaddress: proxy[0],
			port: Number(proxy[1]),
			type: 5
		}
	});
}

function prepareData(a) {
	return new DataView(new ArrayBuffer(a));
}

class Bot {
	constructor(id) {
		this.ws = null;
		this.id = id;
		this.connect();
	}
	connect() {
		this.ws = new WebSocket(server, {
			headers: {
				'Accept-Encoding': 'gzip, deflate',
				'Accept-Language': 'esn-US,en;q=0.9,sq;q=0.8',
				'Cache-Control': 'no-cache',
				'Origin': Origin,
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36'
			},
			agent: agent(this.id)
		});
		this.binaryType = "arraybuffer";
		this.ws.onopen = this.onopen.bind(this);
		this.ws.onmessage = this.onmessage.bind(this);
		this.ws.onclose = this.onclose.bind(this);
		this.ws.onerror = this.onerror.bind(this);
	}
	onopen() {
		var msg = prepareData(5);
        msg.setUint8(0, 254);
        msg.setUint32(1, 1, true);
        this.send(msg);
        msg = prepareData(5);
        msg.setUint8(0, 255);
        msg.setUint32(1, 1332175218, true);
        this.send(msg);
        setInterval(function() {
        	this.spawn(botsNick);
        }.bind(this), 1000);
	}
	onmessage(msg) {}
	onclose(e) {}
	onerror(e) {}
	moveTo(x, y) {
		var msg = prepareData(21);
		msg.setUint8(0, 16);
		msg.setFloat64(1, x, true);
		msg.setFloat64(9, y, true);
		msg.setUint32(17, 0, true);
		this.send(msg);
	}
	spawn(name) {
		var msg = prepareData(1 + 2 * name.length);
		msg.setUint8(0, 0);
		for (var i = 0; i < name.length; ++i) msg.setUint16(1 + 2 * i, name.charCodeAt(i), true);
			this.send(msg);
	}
	split() {
		this.send(new Uint8Array([17]));
	}
	eject() {
		this.send(new Uint8Array([21]));
	}
	send(buf) {
		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        this.ws.send(buf);
	}
}

console.log('Waiting...');