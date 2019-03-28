var MySql = require("mysql");
module.exports = class sqlchecker {
	constructor(ip) {
		this.SQL = null;
		this.ip = ip;
		this.acceptToGetData = false;
		this.data = {};
	}
	getDataUser() {
		this.SQL.query(`SELECT * FROM users WHERE ip='${this.ip}'`, (err, rows) => {
			if(!!err) {
				console.log(err)
			} else {
			this.data = {
				ip: rows[0].ip,
				maxbots: rows[0].max_bots,
				time: rows[0].time_left,
				package: rows[0].package,
				start_time: rows[0].time_start
			}
		}
		});
	}
	connect() {
		this.SQL = MySql.createConnection({
			host: "",
			user : "",
			password: '',
			database: '',
			port: "",
		});		
		this.SQL.connect(function(err) {
			if(!!err) {
				console.log(err)
			} else {
				console.log("[SQL]: Connected succesfully");
				this.acceptToGetData = true;
			}
		});
	}
	log_out(time) {
		this.SQL.query(`UPDATE users SET time_left = '${time}' WHERE ip = '${this.ip}'`, (err) => {
       	});
		//SQL.end();
	}
	getStatus() {
		return this.data;
	}
}