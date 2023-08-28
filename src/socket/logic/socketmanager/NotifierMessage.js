const log = require('../../../config/logger.js')

const messageCreator = require('../MessageCreator.js');

const stateClientsManager = require("../../../logic/StateClientsManager")

exports.notifyToClientWithId = async function (socketServer, plNamespace, socketId, msg) {
  // Used to send ACK: No check on socketId
  log.info(`To Client (Action=${msg.action}, Type=${msg.type}) - Message: ${JSON.stringify(msg)}`)
  socketServer.sendTo(plNamespace, socketId, msg) 
}

exports.notifyToAllClients = async function(socketServer, plNamespace, msgToAll) {
    log.info(`To All Clients - Message: ${JSON.stringify(msgToAll)}`)
    socketServer.sendToAll(plNamespace, msgToAll) 
}