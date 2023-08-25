const log = require('../../../config/logger.js')

const messageCreator = require('../MessageCreator.js');

const stateClientsManager = require("../../../logic/StateClientsManager")

exports.notifyToClientWithId = async function (socketServer, plNamespace, socketId, msg) {
  // Used to send ACK: No check on socketId
  log.info(`To Client (Action=${msg.action}, Type=${msg.type}) - Message: ${JSON.stringify(msg)}`)
  socketServer.sendTo(plNamespace, socketId, msg) 
}

exports.notifyToAllClients = async function(socketServer, plNamespace, requestId, action, type, payload) {
    // Notify to All Clients (only if player is connected)

    let msgToAll = messageCreator.createMessage(
        requestId, 
        playerVR.client_id, 
        playerVR.socket_id , 
        action, 
        type, 
        payload
    )

    log.info(`To All Clients (Action=${action}, Type=${type}) - Payload: ${JSON.stringify(payload)}`)
    socketServer.sendToAll(plNamespace, msgToAll) 
}