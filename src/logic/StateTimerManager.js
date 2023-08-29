const log = require('../config/logger.js');

const stateManager = require("./StateManager.js");

const StateTimerManager = () => {
    let status = stateManager.status.timer

    return {

        /* Timer's Functions */
        getTimerInfo() {
            return status
        },

        getCurrentValue() {
            return status.current_value
        },

        getHolder() {
            return status.holder
        },


        setTimerInfo(timerInfo) {
            status = timerInfo
        },

        setStartingCondition() {
            status.is_started = true
            status.current_value = status.start_value
        },

        setRelaunchingCondition(currentHolder) {
            status.current_value = status.start_value
            status.holder = currentHolder
        },

        setIsStarted(isStarted) {
            if(status.is_started != isStarted) {
                status.is_started = isStarted   
            }
        },

        setNewHolder(name) {
            status.holder = name
        },

        setCurrentValue(newValue) {
            status.current_value = newValue
        },

    }
}

module.exports = StateTimerManager()