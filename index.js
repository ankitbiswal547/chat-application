const http = require("http");
const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const { getMessages, generateURLMessages } = require("./utils/messages");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./utils/users")

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());


io.on('connection', (socket) => {

    socket.on("join", ({username, room}, callback) => {

        const {error, user} = addUser({id:socket.id, username, room});
        if(error) {
            return callback(error);
        }

        socket.join(user.room);
        socket.emit("message", getMessages(`Welcome! nice to meet you ${username}`, "System Message"));
        socket.broadcast.to(user.room).emit("message", getMessages(`${username} has joined`, "System Message"));
        
        const users = getUsersInRoom(user.room);
        io.to(user.room).emit("roomData", {
            users:users,
            room:user.room
        })

        callback();
    })

    socket.on("showText", (textMessage, callback) => {
        const user = getUser(socket.id);

        if(!user) {
            return callback("User does not exist.");
        }
        io.to(user.room).emit("message", getMessages(textMessage, user.username));
        callback();
    })

    socket.on("showLocation", (coords, callback) => {
        const user = getUser(socket.id)
        if(!user) {
            return callback("Username does not exist");
        }
        io.to(user.room).emit("locationMessage", generateURLMessages(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`, user.username));
        callback();

    })
    socket.on("disconnect", () => {
        const user = removeUser(socket.id);
        if(user) {
            io.to(user.room).emit("message", getMessages(`${user.username} has left`, 'System Message'));
        }
        const users = getUsersInRoom(user.room);
        io.to(user.room).emit("roomData", {
            users:users,
            room:user.room
        })
    })
})

const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`server started at port ${port}`);
}) 