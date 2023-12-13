const messageList = document.querySelector("ul");
const nicknameForm = document.querySelector("#nickname");
const chatForm = document.querySelector("#chat");

const socket = new WebSocket(`ws://${window.location.host}`); // 여기서의 socket은, 서버로의 연결을 뜻한다.

socket.addEventListener("open", handleOpen);
socket.addEventListener("message", (message)=> {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});
socket.addEventListener("close", handleClose);

nicknameForm.addEventListener("submit", handleNicknameSubmit);
chatForm.addEventListener("submit", handleChatSubmit);


function handleOpen() {
    console.log("Connected to Server ✔️");
}

function handleClose() {
    console.log("Disconnected from Server ❌");
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = nicknameForm.querySelector("input");
    socket.send( // 왜 string data만 취급할까? 어떤 언어를 사용하는 서버가 받을지 모르는데, 특정 언어에 의존한 객체를 보내는건 좋지 않아. => 즉, 이 websocket은 "브라우저"에 있는 API이기 때문이다.
        JSON.stringify(
            {
                type: "nickname",
                payload: input.value
            }
        )
    );
    input.value = "";
}

function handleChatSubmit(event) {
    event.preventDefault();
    const input = chatForm.querySelector("input");
    socket.send(
        JSON.stringify(
            {
                type: "chat",
                payload: input.value
            }
        )
    );
    input.value = "";
}
