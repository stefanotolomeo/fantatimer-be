const Player = (name, username, password) => {
    return {
        client_id: undefined,
        socket_id: undefined, // The ID of the socket-connection: it changes on every connection/reconnection
        name: name,
        username: username,
        password: password
    }
}

module.exports = Player