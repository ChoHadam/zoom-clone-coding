import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app); //서버에 접근할 수 있게 됨 = 이 서버에 웹소켓 만들 수 있게 됨
const wss = new WebSocket.Server({server}); // http 서버 우에 ws 서버를 올린다. 이렇게 인자로 server 넘기면 같은 서버에서 http와 ws 둘 다 돌릴 수 있게 된다. 두 개가 동일한 포트에 있길 바랄때 이렇게 쓴다.

function onSocketClose() {
    console.log("Disconnected from Browser ❌")
}

function onSocketMessage(message) {
     console.log(message);
}

function handleConnection(socket) { //여기서 소켓은 서버와 연결된 브라우저이다.
    console.log("Connected to Browser ✔️");
    socket.on("close", onSocketClose);
    socket.on("message", onSocketMessage);
    socket.send("hello!!!");
}

wss.on("connection", handleConnection); // on 메소드가 브라우제에서 벡엔드로 연결된 사람의 정보를 제공해주는데, 소켓에 담겨온다.

server.listen(3000, handleListen);
