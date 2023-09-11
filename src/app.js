const log = require('./config/logger.js')

log.debug(`***** Server Application Started at ${new Date().toLocaleString()}`)
var server = {};

if (process.env.MODE == "dev") {
  console.log('Loading dev config')
  server.config = require('./config/config_dev');
}
else {
  console.log('Loading prod config')
  server.config = require('./config/config_prod');
}

server.proxy = require('express-http-proxy');
server.express = require('express');
server.cors = require("cors");
server.app = server.express();
server.app.use(server.cors());
server.fs = require('fs');

server.kill = require('kill-port');

server.http = require('http');
server.https = require('https');

console.log("PROCESS ENV PORT is ", process.env.port)
var port = process.env.PORT || server.config.portHttp // This is 3000
/*server.kill(port, 'tcp')
  .then(function () { log.debug(`***** Killing processes on port ${port}`);  })
  .catch(console.log); //kill whatever process using port*/

  startHttp()
// startHttps();

const SocketServer = require('./socket/socket');
// server.socket = new SocketServer(server.httpsServer);
server.socket = new SocketServer(server.httpServer);
server.socket.init();

server.app.head("/", server.cors(), (req, res) => {
  res.sendStatus(204);
});

const ServerRoutes = require('./router/routers');
server.routes = new ServerRoutes(server);

function startHttp() {
  server.httpServer = server.http.createServer(server.app);
  server.httpServer.listen(port, () => {
  console.log('Server HTTP listening http on *:'+ port)
  log.debug('Server HTTP listening http on *:'+ port)
});
}

/* NOT USED */
function startHttps() {
  server.httpsServer = server.https.createServer(credentials, server.app);
  server.httpsServer.listen(port, () => {
    console.log('Server HTTPS listening https on *:' + port)
    log.debug('Server HTTPS listening https on *:' + port)
  });
}

