const Client = (clientId, socketId) => {
    return {
        client_id: clientId, // The ID coming from Client: it comes from client auth request and is unique into all the application
        socket_id: socketId, // The ID of the socket-connection: it changes on every connection/reconnection

        authenticated_on: Date.now(),
    }
}

module.exports = Client