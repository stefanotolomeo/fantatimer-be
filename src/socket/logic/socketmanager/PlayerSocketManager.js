const log = require('../../../config/logger.js')

const { v4: uuid_v4 } = require('uuid');

/* const Client = require('../../../model/Client.js');

const stateClientsManager = require("../../../logic/game/StateClientsManager");
const stateGamersManager = require("../../../logic/game/StateGamersManager");
const stateGameManager = require("../../../logic/game/StateGameManager");
const stateRequestManager = require("../../../logic/game/StateRequestManager");

const ActionPlayer = require('../../model/player/ActionPlayer.js');

const TypeConnectionPlayer = require('../../model/player/TypeConnectionPlayer');
const TypeAuthenticationPlayer = require('../../model/player/TypeAuthenticationPlayer');

const messageCreator = require('../MessageCreator.js');

const { processPlayerMessage } = require('../messageprocessor/player/PlayerActionProcessor.js');
const ModalityPlayerEnum = require('../../model/ModalityPlayerEnum.js');
const { notifyToController, notifyToPlayerWithId } = require('./NotifierMessage.js'); */

exports.initForPlayer = function (socketServer, data) {
  let ctrlNamespace = socketServer.controllerNamespace
  let plNamespace = socketServer.playerNamespace

  plNamespace.on("connection", (socket) => {
    try {
      log.debug(`Player Connected with Socket-Id=${socket.id}`)

      // Emit an Handshake Event to be managed on Client Side

      socket.on("authenticate", (msg) => {
        let clientId = msg.client_id
        try {
          log.debug(`Player Authenticated with Message=${JSON.stringify(msg)}`)
          /* let mode = msg.mode
          let isNewConnection = true
          let dataToPlayer = {
            video_info: stateGameManager.getVideoInfo(),
            sounds_elements: stateGameManager.getSoundElements(),
            elements: []  // TODO: add all added elements (e.g. text, etc)
          }
          if (clientId && stateClientsManager.getPlayer(mode).client_id == clientId) {
            log.debug(`Reconnection for Player=${clientId} with Mode=${mode}`)
            isNewConnection = false;
            stateClientsManager.saveSocketIdForPlayer(socket.id, mode)
          } else {
            // It's a New-Connection: Save the new Player
            log.debug(`New Connection for Player=${clientId} with Mode=${mode}`)

            // Add the new Client to Clients-Status
            stateClientsManager.setPlayer(Client(clientId, socket.id), mode)
            // Add the new Player to Game-Status
            stateGamersManager.addPlayer(clientId, mode)
          }

          let msgForPlayer = messageCreator.createMessage(msg.request_id, msg.client_id, socket.id, ActionPlayer.AUTHENTICATION, TypeAuthenticationPlayer.LOAD_DATA, dataToPlayer)
      
          // TODO: use MessageCreator
          let msgForController = {
            request_id: msg.request_id,
            action: ActionPlayer.CONNECTION,
            type: isNewConnection ? TypeConnectionPlayer.PLAYER_CONNECTED : TypeConnectionPlayer.PLAYER_RECONNECTED,
            payload: {
              connected_client_id: clientId
            }
          }

          if(mode == ModalityPlayerEnum.VR) {
            // Add Request as completed (just for the Request-To-File Process)
            stateRequestManager.addRequestAsCompleted(msgForController)
          }

          // Send the data to the Player
          notifyToPlayerWithId(socketServer, plNamespace, socket.id, msgForPlayer, mode)

          // Send the notification to Controller
          notifyToController(socketServer, ctrlNamespace, msgForController) */
        } catch (e) {
          log.error(e)
          log.error(`Error while Authenticating Player=${clientId}: ${JSON.stringify(e)}`)
        }
      });

      socket.on("disconnect", async (reason) => {
        try {
          log.debug(`Disconnected Player with Socket-Id=${socket.id} due to: ${reason}`)
          
          /* let plClient = stateClientsManager.getPlayerBySocketId(socket.id)
          if(plClient && plClient.socket_id && plClient.socket_id != socket.id) {
            log.warn(`Socket-Id=${socket.id} not recognized for Disconnected-Player. Found Socket-Id=${plClient.socket_id}`)
            return
          }
          let mode = plClient.mode
          // (1) Remove the Player from Clients
          stateClientsManager.resetPlayer(plClient.client_id, mode)
          // (2) Remove the Player from Gamers
          stateGamersManager.resetPlayer(mode)

          // (3) Notify to Player (only if disconnected player is VR and controller is connected)
          if(mode == ModalityPlayerEnum.VR) {
            
            let msgForController = {
              request_id: uuid_v4(),
              action: ActionPlayer.CONNECTION,
              type: TypeConnectionPlayer.PLAYER_DISCONNECTED,
              payload: {
                disconnected_client_id: plClient.client_id
              }
            }

            // Add Request as completed (just for the Request-To-File Process)
            stateRequestManager.addRequestAsCompleted(msgForController)

            notifyToController(socketServer, ctrlNamespace, msgForController)
          } */

        } catch (e) {
          log.error(`Error while disconnecting Player=${socket.id}`, e)
        }
      });

      socket.on("message", async function (msg) {
        try {
          log.info(`From ${msg.mode} (Action=${msg.action}, Type=${msg.type}) - Message: ${JSON.stringify(msg)}`)

          // await processPlayerMessage(socketServer, plNamespace, ctrlNamespace, msg)
      
        } catch (e) {
          // TODO: manage this log
          log.error(e)
          log.error(`Cannot Manage Message=${JSON.stringify(msg)}: ${JSON.stringify(e)}`)
          notifyToPlayerWithId(socketServer, plNamespace, msg.socket_id, `You sent an Invalid Message`, msg.mode)
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