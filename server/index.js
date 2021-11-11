const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let roomCodes = [];
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const charactersLength = characters.length;

function generateRandomRoomCode() {
    let code = "";
    const codeLength = 4;
    while (code == "" || roomCodes.includes(code)) {
        code = "";
        for (let i = 0; i < codeLength; i++) {
            code += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        console.log(code);
    }
    roomCodes.push(code);
    return code;
}

const publicPath = path.join(__dirname, '/../public');
app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.sendFile(publicPath + "/index.html");
});

app.get('/:code', (req, res) => {
    res.sendFile(publicPath + "/game.html");
});

io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('generate code', (id) => {
        io.to(id).emit('generate code', generateRandomRoomCode());
    });
  });

server.listen(3000, () => {
    console.log('listening on *:3000');
});