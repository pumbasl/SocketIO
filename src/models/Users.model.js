const { Schema, model } = require('mongoose');

const Users = new Schema({
    username: {type: String, required: true},
    online: {type: Boolean, required: true}
});

module.exports = model('Users', Users);