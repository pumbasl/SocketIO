const { Schema, model } = require('mongoose');

const Rooms = new Schema({
    roomId: {type: String, required: true},
    url: {type: String, required: false},
    createdAt: {type: String, required: true}
});

module.exports = model('Rooms', Rooms);