const log = require('../config/logger.js')

let State = require('../model/State');

class StateManager {
    constructor(status) {
        this._status = status
    }

    get status() {
        return this._status;
    }

    set status(status) {
        this._status = status;
    }
}

const stateManager = new StateManager(State())

module.exports = stateManager