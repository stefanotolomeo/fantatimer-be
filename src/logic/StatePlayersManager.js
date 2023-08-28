const log = require('../config/logger.js');

const stateManager = require("./StateManager.js");

const StatePlayersManager = () => {
    let status = stateManager.status.players

    return {

        /* Player's Functions */
        getPlayers() {
            return status
        },

        saveInfoForConnectedPlayer(name, clientId, socketId) {

            i = status.findIndex(el => el.name == name)
            if(i == -1){
                throw new Error(`Invalid Name=${name}. Cannot SavePlayerAsConnected`)
            }
        
            status[i].client_id = clientId
            status[i].socket_id = socketId 
        },

        resetDisconnectedPlayer(clientId) {

            i = status.findIndex(el => el.client_id == clientId)
            if(i == -1){
                throw new Error(`Invalid ClientId=${clientId}. Cannot ResetClient`)
            }

            status[i].socket_id = undefined
            status[i].client_id = undefined
        },

    }
}

module.exports = StatePlayersManager()