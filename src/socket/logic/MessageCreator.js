const Message = require("../model/Message")

exports.createMessageFromMsg = function (msg, payload=undefined) {
    return Message(msg.request_id, msg.client_id, msg.socket_id, msg.action, msg.type, payload);
}

exports.createMessageWithoutClientInfo = function (requestId, action, type, payload=undefined) {
    return Message(requestId, undefined, undefined, action, type, payload);
}

exports.createMessage = function (requestId, clientId, socketId, action, type, payload=undefined) {
    return Message(requestId, clientId, socketId, action, type, payload);
}