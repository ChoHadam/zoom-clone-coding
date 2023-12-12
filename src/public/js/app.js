// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket

// const socket = new WebSocket("ws://localhost:3000");
const socket = new WebSocket(`ws://${window.location.host}`); // 여기서의 socket은, 서버로의 연결을 뜻한다.
