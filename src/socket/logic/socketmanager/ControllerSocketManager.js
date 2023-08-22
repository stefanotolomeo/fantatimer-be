const log = require('../../../config/logger.js')

const { v4: uuid_v4 } = require('uuid');

const Client = require('../../../model/Client.js');

/* const stateClientsManager = require("../../../logic/game/StateClientsManager");
const stateDataManager = require('../../../logic/game/StateDataManager.js');
const stateGamersManager = require("../../../logic/game/StateGamersManager");
const stateGameManager = require("../../../logic/game/StateGameManager");
const stateRequestManager = require('../../../logic/game/StateRequestManager.js');

const ActionController = require('../../model/controller/ActionController.js');

const { processControllerMessage } = require('../messageprocessor/controller/ControllerActionProcessor');

const messageCreator = require('../MessageCreator.js');
const TypeAuthenticationController = require('../../model/controller/TypeAuthenticationController');
const TypeConnectionController = require('../../model/controller/TypeConnectionController');
const ModalityPlayerEnum = require('../../model/ModalityPlayerEnum.js');
const { notifyToPlayerVR, notifyToControllerWithId } = require('./NotifierMessage.js');
const { cancelGetStatus } = require('../messageprocessor/controller/GetStatusInterval.js'); */

exports.initForController = function (socketServer, data) {
  let ctrlNamespace = socketServer.controllerNamespace
  let plNamespace = socketServer.playerNamespace

  ctrlNamespace.on("connection", (socket) => {
    try {
      log.debug(`Controller Connected with Socket-Id=${socket.id}`)

      // Emit an Handshake Event to be managed on Client Side
      // socket.emit("handshake", socket.id, "")

      socket.on("authenticate", (msg) => {
        let clientId = msg.client_id
        try {
          log.debug(`Controller Authenticated with Message=${JSON.stringify(msg)}`)

          /* let isNewConnection = true
          let dataToController = stateDataManager.getAllData()
          if (clientId && stateClientsManager.getController().client_id == clientId) {
            log.debug(`Reconnection for Controller=${clientId}`)
            isNewConnection = false;
            stateClientsManager.saveSocketIdForController(socket.id)

            // Add extra info for Re-Connection
            dataToController.preloaded_info = {
              selected_player_id: stateGamersManager.getPlayer(ModalityPlayerEnum.VR).selected_id,
              selected_controller_id: stateGamersManager.getController().selected_id,
              selected_activity_id: stateGameManager.getActivity(),
              route_index: stateGamersManager.getController().route_index,
              is_segui_enabled: stateGameManager.getIsSeguiEnabled(),
              is_riposiziona_enabled: stateGameManager.getIsRiposizionaEnabled(),
            }

            // Infos about Player status (e.g. is_ready, click_done, is_vr_mode)
            dataToController.player_status = obtainPlayerConnectionStatus()
            
          } else {
            // It's a New-Connection: Save the new Controller
            log.debug(`New Connection for Controller=${clientId}`)

            // Add the new Client to Clients-Status
            stateClientsManager.setController(Client(clientId, socket.id))
            // Add the new Controller to Game-Status
            stateGamersManager.addController(clientId)

            // Add info about Player's status
            dataToController.player_status = obtainPlayerConnectionStatus()
          }

          let msgForController = messageCreator.createMessage(msg.request_id, msg.client_id, socket.id, ActionController.AUTHENTICATION, TypeAuthenticationController.LOAD_DATA, dataToController)
      
          // TODO: use MessageCreator
          let msgForPlayer = {
            request_id: msg.request_id,
            action: ActionController.CONNECTION,
            type: isNewConnection ? TypeConnectionController.CONTROLLER_CONNECTED : TypeConnectionController.CONTROLLER_RECONNECTED,
            payload: {
              connected_client_id: clientId
            }
          }

          // Add Request as completed (just for the Request-To-File Process)
          stateRequestManager.addRequestAsCompleted(msgForPlayer)

          // Send the data to the Controller
          notifyToControllerWithId(socketServer, ctrlNamespace, socket.id, msgForController)

          // Send the notification to Players
          notifyToPlayerVR(socketServer, plNamespace, msgForPlayer) */
          

        } catch (e) {
          log.error(e)
          log.error(`Error while Authenticating Controller=${clientId}: ${JSON.stringify(e)}`)
        }
      });

      socket.on("disconnect", async (reason) => {
        try {
          log.debug(`Disconnected Controller with Socket-Id=${socket.id} due to: ${reason}`)

          /* // TODO: Handle error during disconnection
          let ctrlClient = stateClientsManager.getController()
          if(ctrlClient && ctrlClient.socket_id && ctrlClient.socket_id != socket.id) {
            log.warn(`Socket-Id=${socket.id} not recognized for Disconnected-Controller. Found Socket-Id=${ctrlClient.socket_id}`)
            return
          }

          // HERE the Socket-Id matches the saved-one
          let msgForPlayer = {
            request_id: uuid_v4(),
            action: ActionController.CONNECTION,
            type: TypeConnectionController.CONTROLLER_DISCONNECTED,
            payload: {
              disconnected_client_id: ctrlClient.client_id
            }
          }

          // (1) Add Request as completed (just for the Request-To-File Process)
          stateRequestManager.addRequestAsCompleted(msgForPlayer)
          
          // (2) Remove the Client
          stateClientsManager.resetController(ctrlClient.client_id)

          // (3) Remove GetStatus
          cancelGetStatus()

          // (5) Reset the game for Client-Disconnection
          stateGameManager.resetForControllerDisconnection()
          stateRequestManager.resetRequests()

          // (5) Notify to Player (only if player is connected)
          notifyToPlayerVR(socketServer, plNamespace, msgForPlayer) */

        } catch (e) {
          log.error(`Error while disconnecting Controller=${socket.id}`, e)
        }
      });

      socket.on("message", async function (msg) {
        try {
          log.info(`From CTRL (Action=${msg.action}, Type=${msg.type}) - Message: ${JSON.stringify(msg)}`)

          await processControllerMessage(socketServer, plNamespace, ctrlNamespace, msg)

        } catch (e) {
          // TODO: manage this log
          log.error(e)
          log.error(`Cannot Manage Message=${JSON.stringify(msg)}: ${JSON.stringify(e)}`)
          notifyToControllerWithId(socketServer, ctrlNamespace, msg.socket_id, `You sent an Invalid Message`)
        }
      });

      // If needed, handle it differently
      socket.on('controller-reconnected', function (msg) {
        log.debug(`Controller Reconnected with message: `, msg);
      });

    } catch (e) {
      log.error(`Cannot Connect Controller=${socket.id}`, e)
    }
  });

}

function obtainPlayerConnectionStatus() {
  return {
    is_connected:stateGamersManager.getIsVRConnected(),
    is_ready: stateGamersManager.getIsVRReady(),
    is_click_done: stateGamersManager.getIsVRClickDone(),
    is_vr_mode: stateGamersManager.getIsVRMode()
  }
}