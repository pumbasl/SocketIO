const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const { instrument } = require("@socket.io/admin-ui");
const app = express();

app.use(express.json());
const server = require('http').createServer(app);

const port = process.env.PORT || 5000;

const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true
    }
});

instrument(io, {
    auth: false
});

// получаем обработчики событий
const registerVideoHandlers = require('./handlers/videoHandlers');

const optionsMongo = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

const onConnection = (socket) => {
    console.log('user connected');

    registerVideoHandlers(io, socket);
};

// обрабатываем подключение
io.on('connection', onConnection);

server.listen(port, async () => {
    mongoose.connect(process.env.DATABASE_DEVELOPMENT, optionsMongo);
    console.log('Сервер запустился');
});