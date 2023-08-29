const log = require('../../../config/logger.js')

const messageCreator = require('../MessageCreator.js');

const { noti, notifyToPlayers } = require('../NotifierMessage.js');

const TypeTimer = require('../../model/player/TypeTimer.js');

// const stateRequestManager = require('../../../../logic/game/StateRequestManager.js');

exports.processTypeTimer = async function (socketServer, plNamespace, msg) {
    
    log.debug(`Processing Type=${msg.type} for Action=${msg.action} for Player=${msg.client_id}`)

    switch (msg.type) {
        
        case TypeTimer.STARTED:
            console.log(`TODO: Processing STARTED! ${JSON.stringify(msg)}`)
            // TODO: 
            // (1) setInterval at every second send a notification to time 
            // 
            // notifyToController(socketServer, plNamespace, defaultResponse)
            break

        case TypeTimer.RELAUNCHED:
            console.log(`TODO: Processing RELAUNCHED! ${JSON.stringify(msg)}`)

            // notifyToController(socketServer, plNamespace, defaultResponse)
            break

        case TypeTimer.EXPIRED:
            // TODO: this is not sent by PLAYERS
            console.log(`TODO: Processing EXPIRED! ${JSON.stringify(msg)}`)

            // notifyToController(socketServer, plNamespace, defaultResponse)
            break

        case TypeTimer.SYNCH:
            // TODO: this is not sent by PLAYERS
            console.log(`TODO: Processing SYNCH! ${JSON.stringify(msg)}`)

            break

        default:
            log.warn(`Unrecognized Action=${msg.action}, Type=${msg.type}. Nothing to do: ${JSON.stringify(msg)}`)
            return
    }
}