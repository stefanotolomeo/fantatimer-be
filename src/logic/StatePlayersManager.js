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

    }
}

module.exports = StatePlayersManager()