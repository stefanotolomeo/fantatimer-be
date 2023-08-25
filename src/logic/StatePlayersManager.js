const log = require('../config/logger.js');

const stateManager = require("./StateManager.js");

const StatePlayersManager = () => {
    let status = stateManager.status.players

    return {

        /* Player's Functions */
        getPlayers() {
            return status
        }

    }
}

module.exports = StatePlayersManager()