const socket = io(); //백엔드의 socket.io를 프론트와 연결한다. io 메서드가 알아서 socket.io를 실행하고 있는 백엔드 서버를 찾는다. (설치는 view파일에서 했다.)

const welcome = document.getElementById("welcome");
const room = document.getElementById("room");
const welcomeForm = welcome.querySelector("form");
const roomForm = room.querySelector("form");

room.hidden = true;

let roomName;

welcomeForm.addEventListener("submit", hadleWelcomeFormSubmit);

socket.on("welcome", () => addMessage("someone joined!"));

socket.on("new_message", (msg) => addMessage(msg));

socket.on("bye", () => addMessage("someone disconnected!"));

function hadleWelcomeFormSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  const content = input.value;
  socket.emit("enter_room", content, showRoom); // emit() 파라미터 중에서 함수가 세번째 파라미터로 넘어갔네. 이건 callback이다. 서버가 이 callback을 받아서 호출하면, 브라워에서 함수가 실행되는 매직!
  roomName = content;
  input.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  roomForm.addEventListener("submit", handleMessageSubmit);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("input");
  const content = input.value;
  socket.emit("new_message", content, roomName, () => {
    addMessage(`You: ${content}`);
  });
  input.value = "";
}

function addMessage(msg) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
}
