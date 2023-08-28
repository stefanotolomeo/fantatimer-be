const log = require('../config/logger.js');

const stateManager = require("./StateManager.js");

const StateTimerManager = () => {
    let status = stateManager.status.timer

    return {

        /* Timer's Functions */
        getTimerInfo() {
            return status
        },

        setNewHolder(name) {
            status.holder = name
        },

    }
}

module.exports = StateTimerManager()