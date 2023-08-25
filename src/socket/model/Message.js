const Message = (requestId, clientId, socketId, action, type, payload) => {
    return {
        request_id: requestId,
        client_id: clientId,
        socket_id: socketId,
        action: action,
        type: type,
        payload: payload
    }
}

module.exports = Message