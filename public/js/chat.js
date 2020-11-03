const socket = io()

const text = document.querySelector("#text");
const btn = document.querySelector("#btn");
const locationbtn = document.querySelector("#send-location");
const messages = document.querySelector("#messages");

//templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});


//automatic scrolling when new message loads in
const autoscroll = () => {
    //newMessage
    const newMessage = messages.lastElementChild;

    //height of the new message
    const newMessageMargin = parseInt(getComputedStyle(newMessage).marginBottom);
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

    //visible height
    const visibleHeight = messages.offsetHeight;

    //height of messages container
    const containerHeight = messages.scrollHeight;

    //how far have i scrolled 
    const scrollOffset = messages.scrollTop + visibleHeight;

    if(containerHeight - newMessageHeight <= scrollOffset) {
        messages.scrollTop = messages.scrollHeight;
    }
}

socket.on("message", (message) => {
    const html = Mustache.render(messageTemplate, {
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a'),
        username:message.username
    });
    messages.insertAdjacentHTML("beforeend", html);
    autoscroll();
})

document.querySelector("form").addEventListener("submit", (e) => {
    let textMessage = text.value;
    e.preventDefault();
    btn.setAttribute("disabled", "disabled");
    socket.emit("showText", textMessage, (error) => {
        btn.removeAttribute("disabled");
        text.value = '';
        text.focus();
        if(error) {
            alert(error);
        }
    });
})

socket.on("locationMessage", (url) => {
    const html = Mustache.render(locationTemplate, {
        username:url.username,
        locationLink: url.url,
        locationCreatedAt: moment(url.createdAt).format('h:mm a')
    });
    messages.insertAdjacentHTML("beforeend", html);
    autoscroll();
})

locationbtn.addEventListener("click", () => {
    if(!navigator.geolocation) {
        return alert("Your browser do not support geolocation!");
    }
    locationbtn.setAttribute("disabled", "disabled");
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("showLocation", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            locationbtn.removeAttribute("disabled");
        })
    }); 
})

socket.emit("join", {username, room}, (error) => {
    if(error) {
        alert(error);
        location.href = '/'
    }
});

socket.on("roomData", ({users, room}) => {
    const html = Mustache.render(sidebarTemplate, {
        room:room,
        users:users
    })
    document.querySelector("#sidebar").innerHTML = html;
})