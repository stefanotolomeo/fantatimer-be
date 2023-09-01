const log = require('../../../config/logger.js')

const { v4: uuid_v4 } = require('uuid');

const stateClientsManager = require("../../../logic/StateClientsManager");
const statePlayersManager = require('../../../logic/StatePlayersManager.js');
const stateTimerManager = require('../../../logic/StateTimerManager.js');

const { notifyToAllClients } = require('../NotifierMessage.js');

const ActionPlayer = require('../../model/player/ActionPlayer.js');
const TypeConnectionPlayer = require('../../model/player/TypeConnectionPlayer');
const { processPlayerMessage } = require('../messageprocessor/PlayerActionProcessor.js');

exports.initForPlayer = function (socketServer, data) {
  let plNamespace = socketServer.playerNamespace

  plNamespace.on("connection", (socket) => {
    try {
      log.debug(`Player Connected with Socket-Id=${socket.id}`)

      // Emit an Handshake Event to be managed on Client Side

      socket.on("authenticate", (msg) => {
        let clientId = msg.client_id
        try {
          log.info(`Player Authenticated with Message=${JSON.stringify(msg)}`)

          if (clientId && statePlayersManager.existsPlayerWithClientId(clientId)) {
            // This is a RECONNECTION
            log.info(`Reconnection for Client=${clientId} with SocketId=${socket.id}`)
            stateClientsManager.saveSocketIdForClient(clientId, socket.id)

            statePlayersManager.saveInfoForConnectedPlayerByClientId(clientId, socket.id)

            // Define the content to be passed to this Client
            let dataToPlayer = {
              players: statePlayersManager.getPlayers(),   // All players
              timer: stateTimerManager.getTimerInfo(),     // All timer-info
              new_connected_client_id: msg.client_id
          }

          // MsgForAll includes also messege to current-connected client
          let msgForAll = {
              request_id: msg.request_id,
              action: ActionPlayer.CONNECTION,
              type: TypeConnectionPlayer.PLAYER_CONNECTED,    // No differences here if first CONNECTION or RECONNECTION
              payload: dataToPlayer
          }

          // Send the notification to AllClients
          notifyToAllClients(socketServer, plNamespace, msgForAll)

          return
          }

          // This is a NEW-CONNECTION
          log.info(`New Connection for Client=${clientId} with SocketId=${socket.id}`)

          // Add the new Client to Clients-Status
          stateClientsManager.addNewClient(clientId, socket.id)

        } catch (e) {
          log.error(e)
          log.error(`Error while Authenticating Player=${clientId}: ${JSON.stringify(e)}`)
        }
      });

      socket.on("disconnect", async (reason) => {
        try {
          log.debug(`Disconnected Player with Socket-Id=${socket.id} due to: ${reason}`)
          
          let clientId = stateClientsManager.getClientBySocketId(socket.id)
          if(!clientId) {
            log.warn(`Socket-Id=${socket.id} not recognized for Disconnected-Player. Found Socket-Id=${client.socket_id}`)
            return
          }

          // (1) Remove the Player from Clients
          stateClientsManager.resetClient(clientId)
          
          // (2) Remove the Player from Gamers
          statePlayersManager.resetDisconnectedPlayer(clientId)

          // (3) Notify to Other clients

          // Define the content to be passed to this Client
          let dataToAll = {
            players: statePlayersManager.getPlayers(),   // All players
            timer: stateTimerManager.getTimerInfo()      // All timer-info
          }
          
          let msgForOthers = {
            request_id: uuid_v4(),
            action: ActionPlayer.CONNECTION,
            type: TypeConnectionPlayer.PLAYER_DISCONNECTED,
            payload: dataToAll
          }

          // Send the notification to Player
          notifyToAllClients(socketServer, plNamespace, msgForOthers)

        } catch (e) {
          log.error(`Error while disconnecting Player=${socket.id}`, e)
        }
      });

      socket.on("message", async function (msg) {
        try {
          log.info(`From Client (Action=${msg.action}, Type=${msg.type}) - Message: ${JSON.stringify(msg)}`)

          await processPlayerMessage(socketServer, plNamespace, msg)
      
        } catch (e) {
          // TODO: manage this log
          log.error(e)
          log.error(`Cannot Manage Message=${JSON.stringify(msg)}: ${JSON.stringify(e)}`)
          // notifyToPlayerWithId(socketServer, plNamespace, msg.socket_id, `You sent an Invalid Message`, msg.mode)
        }
      });

      // If needed, handle it differently
      socket.on('player-reconnected', function (msg) {
        log.debug(`Player Reconnected with message: `, msg);
      });

    } catch (e) {
      log.error(`Cannot Connect Player=${socket.id}`, e)
    }
  });
}