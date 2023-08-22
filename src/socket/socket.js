const log = require('../config/logger.js')

const controllerManager = require("./logic/socketmanager/ControllerSocketManager")
const playerManager = require("./logic/socketmanager/PlayerSocketManager")

const timer = ms => new Promise(res => setTimeout(res, ms))

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

    this.controllerNamespace = this.io.of("/controller");
    this.playerNamespace = this.io.of("/player");
  }

  async init() {
    try {
      console.log("Starting SOCKET")
      // TODO: load data from DB
      let  data = {
        dataForController:"todo",
        dataForPlayer:"todo"
      }

      controllerManager.initForController(this, data.dataForController)
      playerManager.initForPlayer(this, data.dataForPlayer)
    } catch (e) {
      // TODO: manage this log
      console.error(e)
      log.error(e)
      log.error(`Error while initializing Socket: ${JSON.stringify(e)}`)
    }

  }

  joinRoom(socket, roomName) {
    try {
      socket.join(roomName)
    } catch (e) {
      log.error(`Error while joining Room=${roomName}: ${JSON.stringify(e)}`)
    }
  }

  joinRoomWithSocketId(namespace, socketId, roomName) {
    try {
      namespace.sockets.get(socketId).join(roomName)
    } catch (e) {
      log.error(`Error while joining Room=${roomName} with SocketId=${socketId}: ${JSON.stringify(e)}`)
    }
  }

  async clearRoom(roomName) {
    try {
      const socketIds = this.playerNamespace.adapter.rooms.get(roomName);
      if (!socketIds) {
        log.debug(`No Clients Found in Room=${roomName}. No one must leave the room.`)
        return
      }
      socketIds.forEach(sockId => this.playerNamespace.sockets.get(sockId).leave(roomName));
    } catch (e) {
      log.error(`Error while clearing Room=${roomName}: ${JSON.stringify(e)}`)
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

  sendToRoom(namespace, socketRoom, message) {
    try {
      namespace.to(socketRoom).emit("message", message)
    } catch (e) {
      log.error(`Error while sending Message=${message}: ${JSON.stringify(e)}`)
    }
  }
}
