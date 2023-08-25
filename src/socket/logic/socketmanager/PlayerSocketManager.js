const log = require('../../../config/logger.js')

const { v4: uuid_v4 } = require('uuid');

const Client = require('../../../model/Client.js');
const stateClientsManager = require("../../../logic/StateClientsManager");
const StatePlayersManager = require('../../../logic/StatePlayersManager.js');
const { notifyToAllClients, notifyToClientWithId } = require('./NotifierMessage.js');
/* 

const stateGamersManager = require("../../../logic/game/StateGamersManager");
const stateGameManager = require("../../../logic/game/StateGameManager");
const stateRequestManager = require("../../../logic/game/StateRequestManager");

const ActionPlayer = require('../../model/player/ActionPlayer.js');

const TypeConnectionPlayer = require('../../model/player/TypeConnectionPlayer');
const TypeAuthenticationPlayer = require('../../model/player/TypeAuthenticationPlayer');

const messageCreator = require('../MessageCreator.js');

const { processPlayerMessage } = require('../messageprocessor/player/PlayerActionProcessor.js');
const ModalityPlayerEnum = require('../../model/ModalityPlayerEnum.js');
*/

exports.initForPlayer = function (socketServer, data) {
  let plNamespace = socketServer.playerNamespace

  plNamespace.on("connection", (socket) => {
    try {
      log.debug(`Player Connected with Socket-Id=${socket.id}`)

      // Emit an Handshake Event to be managed on Client Side

      socket.on("authenticate", (msg) => {
        let clientId = msg.client_id
        try {
          log.debug(`Player Authenticated with Message=${JSON.stringify(msg)}`)

          let isNewConnection = true
          if (clientId && stateClientsManager.existsClient(clientId)) {
            log.debug(`Reconnection for Client=${clientId} with SocketId=${socket.id}`)
            isNewConnection = false;
            stateClientsManager.saveSocketIdForClient(socket.id, mode)
          } else {
            // It's a New-Connection: Save the new Player
            log.debug(`New Connection for Client=${clientId} with SocketId=${socket.id}`)

            // Add the new Client to Clients-Status
            stateClientsManager.addNewClient(Client(clientId, socket.id))
            
            // TODO: to be handled
            // Add the new Player to Game-Status
            // stateGamersManager.addPlayer(clientId, mode)
          }

          // Define the content to be passed to this Client
          let dataToPlayer = {
            clients: stateClientsManager.getClients(),  // All connected-clients
            players: StatePlayersManager.getPlayers()   // All players
          }

          // Create Message to reply this Client
          let msgForClient = messageCreator.createMessage(
            msg.request_id, msg.client_id, socket.id, ActionPlayer.AUTHENTICATION, TypeAuthenticationPlayer.LOAD_DATA, dataToPlayer)

          let msgForOthers = {
            request_id: msg.request_id,
            // action: ActionPlayer.CONNECTION,
            // type: isNewConnection ? TypeConnectionPlayer.PLAYER_CONNECTED : TypeConnectionPlayer.PLAYER_RECONNECTED,
            payload: dataToPlayer
          }

          // Send the data to the Player
          notifyToClientWithId(socketServer, plNamespace, socket.id, msgForClient)

          // Send the notification to Controller
          notifyToAllClients(socketServer, plNamespace, msgForOthers)

        } catch (e) {
          log.error(e)
          log.error(`Error while Authenticating Player=${clientId}: ${JSON.stringify(e)}`)
        }
      });

      socket.on("disconnect", async (reason) => {
        try {
          log.debug(`Disconnected Player with Socket-Id=${socket.id} due to: ${reason}`)
          
          let client = stateClientsManager.getClientBySocketId(socket.id)
          if(client && client.socket_id && client.socket_id != socket.id) {
            log.warn(`Socket-Id=${socket.id} not recognized for Disconnected-Player. Found Socket-Id=${client.socket_id}`)
            return
          }

          // (1) Remove the Player from Clients
          stateClientsManager.resetClient(plClient.client_id, mode)
          // (2) Remove the Player from Gamers
          // TODO: reset from here as well
          // stateGamersManager.resetPlayer(mode)

          // (3) Notify to Other clients

          // Define the content to be passed to this Client
          let dataToAll = {
            clients: stateClientsManager.getClients(),  // All connected-clients
            players: StatePlayersManager.getPlayers()   // All players
          }
          
          let msgForOthers = {
            request_id: uuid_v4(),
            action: ActionPlayer.CONNECTION,
            type: TypeConnectionPlayer.PLAYER_DISCONNECTED,
            payload: dataToAll
          }

          // Send the notification to Controller
          notifyToAllClients(socketServer, plNamespace, msgForOthers)

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