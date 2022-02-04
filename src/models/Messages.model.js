const { Schema, model } = require('mongoose');

const Messages = new Schema({
    userId: {type: String, required: true},
    senderName: {type: String, required: true},
    messageText: {type: String, requred: true},
    createdAt: {type: String, required: true}
});

module.exports = model('Messages', Messages);