const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

const socket = io(); //백엔드의 socket.io를 프론트와 연결한다. io 메서드가 알아서 socket.io를 실행하고 있는 백엔드 서버를 찾는다. (설치는 view파일에서 했다.)

form.addEventListener("submit", handleRoomSubmit);

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", {payload: input.value}, () => {
        console.log("server is done!")
    }); // 세번째 파라미터는 callback이다. 서버가 이 callback을 받아서 호출하면, 브라워에서 함수가 실행되는 매직! Socket.io의 emit()은 파라미터 개수가 몇 개든 어떤 형태로든 넘길 수 있다.
    input.value = "";
}
