const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
const server = require('http').createServer(app);

const port = process.env.PORT || 5000;

const { Server } = require('socket.io');
const io = new Server(server);

// получаем обработчики событий
const registerMessageHandlers = require('./handlers/messageHandlers')
const registerUserHandlers = require('./handlers/userHandlers')

const optionsMongo = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

const onConnection = (socket) => {
    console.log('user connected');

    // получаем название комнаты из строки запроса "рукопожатия"
    const { roomId } = socket.handshake.query
    // сохраняем название комнаты в соответствующем свойстве сокета
    socket.roomId = roomId

    // присоединяемся к комнате (входим в нее)
    socket.join(roomId)

    // регистрируем обработчики
    // обратите внимание на передаваемые аргументы
    registerMessageHandlers(io, socket)
    registerUserHandlers(io, socket)

    // обрабатываем отключение сокета-пользователя
    socket.on('disconnect', () => {
        // выводим сообщение
        log('User disconnected')
        // покидаем комнату
        socket.leave(roomId)
    })
};

// обрабатываем подключение
io.on('connection', onConnection)

server.listen(port, async () => {
    mongoose.connect(process.env.DATABASE_DEVELOPMENT, optionsMongo);
    console.log('Сервер запустился');
});