const socket = io();

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const container = document.querySelector(".container");


const append = (message, position) => {
    const messageElement = document.createElement("div");

    messageElement.innerText = message;

    messageElement.classList.add('message');

    messageElement.classList.add(position);

    container.append(messageElement);

    if (position === 'right') {
        document.addEventListener(('sound'), () => {
            var audio = new Audio("sound.mp3");
            audio.play();
        })
    }

}


const UserName = prompt("Enter name to join the chat");

socket.emit('new-user-joined', UserName);

socket.on('user-joined', UserName => {
    append(`${UserName} joined the Chat`, 'right');
});

socket.on('receive', data => {
    append(`${data.UserName} :${data.message} `, 'right');
});

socket.on('leave', name => {
    append(`${name} has left the chat`, 'right');
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You : ${message}`, 'left');
    socket.emit('send', message);
    messageInput.value = '';
});