const TypeTimer = {
    // For Action=TIMER
    
    // Sent by Clients (to Server)
    STARTED: "started",
    RELAUNCHED: "relaunched",

    // Received by Client (sent by Server)
    EXPIRED: "expired",
    SYNCH: "synch",

}

module.exports = TypeTimer