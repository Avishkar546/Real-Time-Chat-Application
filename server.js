//Node server which will handle socket io connections. 

const socketIO = require('socket.io');  // Handle two way connection
const express = require("express");  // Handle the request 
const http = require("http");  // create the server

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname + "/public")); // Serving static files 

const users = {};  // Array to store the users joined

app.get('/favicon.ico', (req, res) => { // To handle the favicon
    res.status(204).end();
});

io.on('connection', (socket) => { //default event connection 
    socket.on('new-user-joined', UserName => {
        // console.log("Your name",UserName);
        users[socket.id] = UserName;
        socket.broadcast.emit('user-joined', UserName);  // user-joined event listen
    });

    socket.on('send', message => { //Developer defined event 
        // console.log(message);
        socket.broadcast.emit('receive', { message: message, UserName: users[socket.id] }); // receive event listen
    });

    socket.on('disconnect', message => {  //DEFAULT event disconnection
        socket.broadcast.emit('leave', users[socket.id]);  // leave event listen
        delete users[socket.id];
    });
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
}) 