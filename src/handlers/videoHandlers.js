const RoomsModel = require('../models/Rooms.model');
const { nanoid } = require('nanoid');

module.exports = (io, socket) => {
    const createRoom = async () => {
        const newIdRoom = nanoid();
        socket.roomId = newIdRoom;

        socket.join(newIdRoom);
        
        const newRoom = new RoomsModel({
            roomId: newIdRoom,
            url: '',
            createdAt: Date.now()
        });

        await newRoom.save();
        io.in(socket.roomId).emit('room:createSuccsess', newIdRoom);
    };

    const newUrl = async (url) => { 
        await RoomsModel.findOneAndUpdate({ roomId: socket.roomId }, { url });
        io.in(socket.roomId).emit('room:urlUpdate', url);
    };

    const checkRoom = async (id) => {
        const checkedRoom = await RoomsModel.findOne({ roomId: id });
        if(checkedRoom){
            socket.join(id);
            socket.roomId = id;
            io.to(socket.id).emit('room:checkAnswer', { code: true, url: checkedRoom.url });
        } else {
            io.to(socket.id).emit('room:checkAnswer', { code: false });
        }
    };

    const disconnect = async () => {
        console.log('User disconnected: ', socket.roomId);
        socket.leave(socket.roomId);
    };

    socket.on('room:create', createRoom);
    socket.on('room:newUrl', newUrl);
    socket.on('room:check', checkRoom);
    socket.on('disconnect', disconnect);
};