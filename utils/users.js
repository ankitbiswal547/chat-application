// addUser(), removeUser(), getUser(), getUsersInRoom()
const users = [];

//addUser();
const addUser = ({id, username, room}) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //validate user
    if(!username || !room) {
        return {
            error: "Username and Room are required"
        }
    }

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if(existingUser !== undefined) {
        return {
            error: "Username already exists!"
        }
    }

    const user = {id, username, room};
    users.push(user);
    return {user}

}

//removeUser()
const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if(index !== -1) {
        return users.splice(index, 1)[0]
    }

}

//get a particular user
const getUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if(index !== -1) {
        return users[index];
    }

    return undefined
}

//get all users by room name
const getUsersInRoom = (room) => {
    if(!room) {
        return {
            error: "Room is required"
        }
    }

    room = room.trim().toLowerCase();

    const allusers = users.filter((user) => {
        return user.room === room
    })
    if(allusers === undefined) {
        return {
            error: "No users are there in this room"
        }
    }
    return allusers
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}