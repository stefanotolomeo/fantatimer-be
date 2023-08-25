const path = require('path');

var config = {};
if (process.env.MODE == "dev") config = require('../config/config_dev');
else config = require('../config/config_prod');

const stateManager = require('../logic/StateManager');

const homeRouter = require('./homeRouter');

module.exports = class ServerRoutes {

	constructor(server) {
		server = server;
		this.app = server.app;
		this.express = server.express;
		this.proxy = server.proxy;

		this.activities = [];

		this.app.use(function (req, res, next) {
			var filename = path.basename(req.url);
			var extension = path.extname(filename);
			if (extension != "") {
				//console.log("- " + filename + " was requested.");
			}else{
				//console.log(process.cwd(), __dirname)
			}
			if(filename=="viewer"){
				//console.log("ROOT: "+config.player);
			}

			next();
		});

		//-------------- ROOT ---------------//    
		this.app.use('/', homeRouter)

		//-------------- LOG ---------------//
		this.app.get('/api/logs', (req, res) => {
			res.sendFile(path.join(__dirname + '../../../logs/logs.log'));
		});

		//-------------- STATUS ---------------//    
		this.app.get('/api/status', (req, res) => {
			let currStatus = Object.assign({}, stateManager.status)

			/* let requestsArray = Array.from(currStatus.requests.values())
			currStatus.requests = requestsArray */
 		
			res.json(currStatus)
		});

		this.app.get('/api/status/clients', (req, res) => {
			let currStatus = Object.assign({}, stateManager.status.clients)
			res.json(currStatus)
		});
	}

}