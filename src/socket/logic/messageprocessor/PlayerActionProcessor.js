const log = require('../../../config/logger.js')

const ActionPlayer = require('../../model/player/ActionPlayer.js');
const { processTypeTimer } = require('./TypeTimerProcessor.js');

exports.processPlayerMessage = async function (socketServer, plNamespace, msg) {
    
    switch (msg.action) {
        
        /* case ActionPlayer.CONNECTION:
            await processTypeStatus(socketServer, plNamespace, msg)
            break */
        
        case ActionPlayer.TIMER:
            await processTypeTimer(socketServer, plNamespace, msg)
            break

        default:
            log.warn(`Unrecognized Action for Player=${msg.client_id}. Nothing to do for ACTION=${msg.action}: ${JSON.stringify(msg)}`)
            return
    }
}