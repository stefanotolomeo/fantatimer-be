const ActionPlayer = {
    // Connection
    // with Types: PLAYER_CONNECTED, PLAYER_RECONNECTED, PLAYER_DISCONNECTED
    CONNECTION: "connection",

    // Authentication
    // with Types: LOAD_DATA
    AUTHENTICATION: "authentication",   // TODO: likely not used

    // with Types: STARTED, RELAUNCHED, EXPIRED, SYNCH
    TIMER: "timer"

}

module.exports = ActionPlayer