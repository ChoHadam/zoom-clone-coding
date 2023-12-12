// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket

// const socket = new WebSocket("ws://localhost:3000");
const socket = new WebSocket(`ws://${window.location.host}`); // 여기서의 socket은, 서버로의 연결을 뜻한다.

socket.addEventListener("open", () => {
    console.log("Connected to Server ✔️");
});

socket.addEventListener("message", (message) =>  {
    console.log("New message: ", message.data)
});

socket.addEventListener("close", () => {
    console.log("Disconnected from Server ❌");
});

setTimeout(() => {
    socket.send("hello from the Browser!!");
}, 10000);