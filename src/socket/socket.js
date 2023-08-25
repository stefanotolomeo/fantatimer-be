const log = require('../config/logger.js')

const playerManager = require("./logic/socketmanager/PlayerSocketManager")
const statePlayersManager = require('../logic/StatePlayersManager.js');


module.exports = class SocketServer {
  constructor(http) {
    this.io = require("socket.io")(http, {
      cors: {
        //origin: ["http://127.0.0.1:3000", "http://127.0.0.1:8080"],
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        allowedHeaders: ["fantatimer-socket-header"],
        credentials: true,
        optionsSuccessStatus: 202,
        secure: true,
      },
    });

    this.playerNamespace = this.io.of("/player");
  }

  async init() {
    try {
      console.log("Starting SOCKET")

      // Data to be sent to each client at connection
      let  data = statePlayersManager.getPlayers()

      playerManager.initForPlayer(this, data)
    } catch (e) {
      // TODO: manage this log
      console.error(e)
      log.error(e)
      log.error(`Error while initializing Socket: ${JSON.stringify(e)}`)
    }

  }

  sendTo(namespace, id, message) {
    try {
      log.debug(`Sending to Socket-ID=${id} for Namespace=${namespace} the Message=${JSON.stringify(message)}`)
      namespace.to(id).emit("message", message)
    } catch (e) {
      log.error(`Error while sending Message=${message} to Socket-Id=${id}: ${JSON.stringify(e)}`)
    }
  }

  sendToAll(namespace, message) {
    try {
      namespace.emit("message", message)
    } catch (e) {
      log.error(`Error while sending Message=${message}: ${JSON.stringify(e)}`)
    }
  }

}
