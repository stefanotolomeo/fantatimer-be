const log = require('../config/logger.js');
const Client = require('../model/Client.js');

const stateManager = require("./StateManager");

const StateClientsManager = () => {
    let status = stateManager.status.clients
    let i

    return {

        getClients() {
            return status
        },

        existsClient(clientId) {
            return status.has(clientId)
        },

        getClientByClientId(clientId) {
            if(!status.has(clientId)) {
                throw new Error(`Invalid ClientId=${clientId}. Cannot GetClientByClientId`)
            }

            return status.get(clientId)
        },

        getClientBySocketId(socketId) {
            let foundClientId
            for (let [key, value] of status.entries()) {
                if(value == socketId) {
                    foundClientId = key
                    break
                }
            }

            if(!foundClientId){
                throw new Error(`Invalid SocketId=${socketId}. Cannot GetClientBySocketId`)
            }

            return foundClientId
        },

        saveSocketIdForClient(clientId, socketId) {
            status.set(clientId, socketId)
        },

        addNewClient(clientId, socketId) {
            status.set(clientId, socketId)
        },

        resetClient(clientId) {
            status.delete(clientId)
        },

    }
}

module.exports = StateClientsManager()