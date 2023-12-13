import http from "http";
// socket.io는 websocket의 구현체가 아니다. 
// 웹소켓을 일부 사용하면서 여러 기능을 제공하는 새로운 프레임워크다. (채팅방, 재연결 등)
// 따라서, 만약 websocket 이용이 불가능해져도, socket.io는 다른 방법을 이용해서 계속해서 동작한다. (HTTP long-polling)
import SocketIO from "socket.io"; 
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  
  socket.on("enter_room", (msg, done) => {
    console.log('msg', msg);
    setTimeout(()=> {
      done();
    }, 15000);
  }); 

});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
