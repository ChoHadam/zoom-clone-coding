const socket = io(); //백엔드의 socket.io를 프론트와 연결한다. io 메서드가 알아서 socket.io를 실행하고 있는 백엔드 서버를 찾는다. (설치는 view파일에서 했다.)

const welcome = document.getElementById("welcome");
const room = document.getElementById("room");
const nickname = document.getElementById("nickname")
const welcomeForm = welcome.querySelector("form");
const roomForm = room.querySelector("form");
const nicknameForm = nickname.querySelector("form");

room.hidden = true;

let roomName;

welcomeForm.addEventListener("submit", hadleWelcomeFormSubmit);
nicknameForm.addEventListener("submit", hadleNicknameFormSubmit);

socket.on("welcome", (nickname) => {
  console.log('[app.js] on "welcome"');
  addMessage(`${nickname} joined!`);
});

socket.on("new_message", (msg) => addMessage(msg));

socket.on("bye", (nickname) => {
  console.log('[app.js] on "bye"');
  addMessage(`${nickname} disconnected!`);
});

// 문제 1) rooms에 배열이 들어올때마다, 기존 roomList에 배열이 추가된다. 
// => 매번 roomList를 수동으로 초기화하는 코드를 추가했다.
// 문제 2) 빈 배열이 들어오면, 공백이 추가된다.
// => 빈 배열이 들어오면 아무것도 하지 않는 로직을 추가했다.
socket.on("room_changed", (rooms) => { 
  console.log('[app.js] on "room_changed"');

  const roomList = welcome.querySelector("ul"); 
  roomList.innerText = ""; // 문제 1) 해결

  if (rooms.length === 0) { // 문제 2) 해결
    return;
  }
  
  const ul = welcome.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = rooms;
  ul.appendChild(li);
})

function hadleWelcomeFormSubmit(event) {
  console.log("[app.js] in hadleWelcomeFormSubmit()");
  
  event.preventDefault();
  
  const input = welcomeForm.querySelector("input");
  const content = input.value;
  
  socket.emit("enter_room", content, showRoom); // emit() 파라미터 중에서 함수가 세번째 파라미터로 넘어갔네. 이건 callback이다. 서버가 이 callback을 받아서 호출하면, 브라워에서 함수가 실행되는 매직!
  roomName = content;
  input.value = "";
}

function showRoom() {
  console.log("[app.js] in showRoom()");
  
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  
  roomForm.addEventListener("submit", handleMessageSubmit);
}

function handleMessageSubmit(event) {
  console.log("[app.js] in handleMessageSubmit()");
  
  event.preventDefault();
  
  const input = room.querySelector("input");
  const content = input.value;
  
  socket.emit("new_message", content, roomName, () => {
    console.log("[app.js] emit new_message");
    addMessage(`You: ${content}`);
  });
  input.value = "";
}

function addMessage(msg) {
  console.log("[app.js] in addMessage()");
  
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
}

function hadleNicknameFormSubmit(event) {
  console.log("[app.js] in hadleNicknameFormSubmit()");
  
  event.preventDefault();
  const input = nicknameForm.querySelector("input");
  const content = input.value;
    
  socket.emit("nickname", content); 
}
