const MessagesModel = require('../models/Messages.model');

module.exports = (io, socket) => {
    const getMessages = async () => {
        const messages = await MessagesModel.find().lean();
        io.in(socket.roomId).emit('messages', messages);
    };

    const addMessage = async (message) => {
        const newMessage = new MessagesModel({
            createdAt: new Date(),
            ...message
        });
        await newMessage.save();

        await getMessages();
    };

    const removeMessage = async (messageId) => {
        await MessagesModel.deleteOne({ _id: messageId });

        await getMessages();
    };

    socket.on('message:get', getMessages);
    socket.on('message:add', addMessage);
    socket.on('message:remove', removeMessage);
};