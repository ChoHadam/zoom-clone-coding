// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket

// const socket = new WebSocket("ws://localhost:3000");
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

setTimeout(() => {
    socket.send("hello from the Browser!!");
}, 10000);