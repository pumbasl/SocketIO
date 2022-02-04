const UsersModel = require('../models/Users.model');

module.exports = (io, socket) => {
    const getUsers = async () => {
        const allUsers = await UsersModel.find();
        io.in(socket.roomId).emit('users', allUsers);
    };

    const addUser = async ({ username, userId }) => {
        const checkUser = await UsersModel.findOne({ _id: userId });

        if(!checkUser){
            const newUser = new UsersModel({
                username,
                online: true
            });

            await newUser.save();
        } else {
            checkUser.online = true;
            checkUser.save();
        }

        await getUsers();
    };

    const offUser = async (userId) => {
        await UsersModel.findOneAndUpdate({ _id: userId }, { online: false });

        await getUsers();
    };

    socket.on('user:get', getUsers)
    socket.on('user:add', addUser)
    socket.on('user:leave', offUser)
};