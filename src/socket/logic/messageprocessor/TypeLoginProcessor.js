const log = require('../../../config/logger.js')

const { v4: uuid_v4 } = require('uuid');

const messageCreator = require('../MessageCreator.js');

const { notifyToAllClients } = require('../NotifierMessage.js');

const ActionPlayer = require('../../model/player/ActionPlayer.js');
const TypeLogin = require('../../model/player/TypeLogin.js');

const statePlayersManager = require('../../../logic/StatePlayersManager.js');
const stateTimerManager = require('../../../logic/StateTimerManager.js');
const TypeConnectionPlayer = require('../../model/player/TypeConnectionPlayer.js');


exports.processTypeLogin = async function (socketServer, plNamespace, msg) {
    log.debug(`Processing Action=${msg.action}, Type=${msg.type} for Message=${JSON.stringify(msg)}`)

    let msgToAll

    switch (msg.type) {
        
        case TypeLogin.LOGIN:
            
            // Check usernamen+pw and login 
            statePlayersManager.saveInfoForConnectedPlayer(msg.payload.username, msg.payload.password, msg.client_id, msg.socket_id)

            // Create a SYNCH message to Players
            /* msgToAll = messageCreator.createMessageWithoutClientInfo(
                uuid_v4(), 
                ActionPlayer.LOGIN, 
                TypeTimer.LOGIN,
                
              )

            notifyToAllClients(socketServer, plNamespace, msgToAll) */

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
            
            break

        default:
            log.warn(`Unrecognized Action=${msg.action}, Type=${msg.type}. Nothing to do: ${JSON.stringify(msg)}`)
            return
    }
}