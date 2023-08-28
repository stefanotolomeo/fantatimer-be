const Player = (name, username, password) => {
    return {
        name: name,
        username: username,
        password: password,
        client_id: undefined,
        socket_id: undefined, // The ID of the socket-connection: it changes on every connection/reconnection
    }
}

module.exports = Player