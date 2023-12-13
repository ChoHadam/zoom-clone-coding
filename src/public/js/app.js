const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
room.hidden = true;

let roomName;

const socket = io(); //백엔드의 socket.io를 프론트와 연결한다. io 메서드가 알아서 socket.io를 실행하고 있는 백엔드 서버를 찾는다. (설치는 view파일에서 했다.)

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => addMessage("someone joined!"));

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom); // 세번째 파라미터는 callback이다. 서버가 이 callback을 받아서 호출하면, 브라워에서 함수가 실행되는 매직!
    roomName = input.value;
    input.value = "";
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
}

function addMessage(msg) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = msg;
    ul.appendChild(li);
}
