const log = require('../../../config/logger.js')

const { v4: uuid_v4 } = require('uuid');

const messageCreator = require('../MessageCreator.js');

const { notifyToAllClients } = require('../NotifierMessage.js');

const ActionPlayer = require('../../model/player/ActionPlayer.js');
const TypeTimer = require('../../model/player/TypeTimer.js');

const stateTimerManager = require('../../../logic/StateTimerManager.js');


var myInterval; // this is the interval-ID

exports.processTypeTimer = async function (socketServer, plNamespace, msg) {
    log.debug(`Processing Action=${msg.action}, Type=${msg.type} for Message=${JSON.stringify(msg)}`)

    let timerInfo, msgToAll

    switch (msg.type) {
        
        case TypeTimer.STARTED:
            if(myInterval) {
                log.warn("Timer-Started Request: MyInterval already exists. Ignoring message")
                return
            }

            // Here Interval needs to be set
            log.debug("Timer-Started Request: MyInterval not exists: creating..")

            // Set Starting Conditions
            stateTimerManager.setStartingCondition()
            myInterval = setInterval(decreaseTimerAndNotify, 1000, socketServer, plNamespace)

            timerInfo = stateTimerManager.getTimerInfo()

            // Create a SYNCH message to Players
            msgToAll = messageCreator.createMessageWithoutClientInfo(
                uuid_v4(), 
                ActionPlayer.TIMER, 
                TypeTimer.SYNCH,
                {timer: timerInfo}
              )

            notifyToAllClients(socketServer, plNamespace, msgToAll)
            
            break

        case TypeTimer.RELAUNCHED:
            // TODO: set this
            stateTimerManager.setRelaunchingCondition("currentholder")

            timerInfo = stateTimerManager.getTimerInfo()

            msgToAll = messageCreator.createMessageWithoutClientInfo(
                uuid_v4(), 
                ActionPlayer.TIMER, 
                TypeTimer.SYNCH,
                {timer: timerInfo}
              )

            notifyToAllClients(socketServer, plNamespace, msgToAll)
            break

        default:
            log.warn(`Unrecognized Action=${msg.action}, Type=${msg.type}. Nothing to do: ${JSON.stringify(msg)}`)
            return
    }
}

function decreaseTimerAndNotify(socketServer, plNamespace) {
    try {
        let timerInfo = stateTimerManager.getTimerInfo()
        let newTime = timerInfo.current_value - 1

        timerInfo.current_value = newTime
        
        let msgToAll
        if(newTime > 0) {
            // Create a SYNCH message to Players
            msgToAll = messageCreator.createMessageWithoutClientInfo(
                uuid_v4(), 
                ActionPlayer.TIMER, 
                TypeTimer.SYNCH,
                {timer: timerInfo}
              )

        } else {
            // Create an EXPIRE message to Players
            msgToAll = messageCreator.createMessageWithoutClientInfo(
                uuid_v4(), 
                ActionPlayer.TIMER, 
                TypeTimer.EXPIRED,
                {timer: timerInfo}
              )

            timerInfo.is_started = false

            // Ensure the Function is canceled
            clearInterval(myInterval)
            myInterval = undefined
        }

        stateTimerManager.setTimerInfo(timerInfo)
        // stateTimerManager.setCurrentValue(newTime)

          
        notifyToAllClients(socketServer, plNamespace, msgToAll)
    } catch (e) {
        log.error(`Error while Getting-Status from VR`, e)
    }
}