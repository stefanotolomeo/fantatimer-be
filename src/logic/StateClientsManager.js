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
            i = status.findIndex(el => el.client_id == clientId)
            if(i == -1){
                return false
            }

            return true
        },

        getClientByClientId(clientId) {
            i = status.findIndex(el => el.client_id == clientId)
            if(i == -1){
                throw new Error(`Invalid ClientId=${clientId}. Cannot GetClientByClientId`)
            }

            return status[i]
        },

        getClientBySocketId(socketId) {
            i = status.findIndex(el => el.socket_id == socketId)
            if(i == -1){
                throw new Error(`Invalid SocketId=${socketId}. Cannot GetClientBySocketId`)
            }

            return status[i]
        },

        saveSocketIdForClient(clientId, socketId) {

            i = status.findIndex(el => el.client_id == clientId)
            if(i == -1){
                throw new Error(`Invalid ClientId=${clientId} and SocketId=${socketId}. Cannot SaveSockectForClient`)
            }
        
            status[i].socket_id = socketId 
        },

        addNewClient(client) {
            status.push(client)
        },

        resetClient(clientId) {

            i = status.findIndex(el => el.client_id == clientId)
            if(i == -1){
                throw new Error(`Invalid ClientId=${clientId}. Cannot ResetClient`)
            }

            status[i] = Client(clientId)
        },

    }
}

module.exports = StateClientsManager()