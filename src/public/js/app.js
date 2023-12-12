const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

const socket = new WebSocket(`ws://${window.location.host}`); // 여기서의 socket은, 서버로의 연결을 뜻한다.

function handleOpen() {
    console.log("Connected to Server ✔️");
}

function handleMessage(message) {
    console.log("New message: ", message.data)
}

function handleClose() {
    console.log("Disconnected from Server ❌");
}

socket.addEventListener("open", handleOpen);
socket.addEventListener("message", handleMessage);
socket.addEventListener("close", handleClose);


function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(input.value);
    input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);