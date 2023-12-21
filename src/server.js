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
  socket["nickname"] = "Anonymous";
  wsServer.sockets.emit("room_changed", getPublicRooms()); 
  
  socket.on("enter_room", (roomName, done) => {
    console.log('[server.js] on "enter_room"');
  
    socket.join(roomName);
    done(getRoomSize(roomName));
    
    socket.to(roomName).emit("welcome", socket["nickname"], getRoomSize(roomName));

    wsServer.sockets.emit("room_changed", getPublicRooms()); 
  });

  socket.on("new_message", (message, roomName, done) => {
    console.log('[server.js] on "new_message"');
    
    socket.to(roomName).emit("new_message", `${socket["nickname"]}: ${message}`);
    done();
  });

  socket.on("disconnecting", () => { // socket.io 제공 이벤트 중 하나. 소켓 접속이 끊어지는것을 감지하고, 끊어지기 "직전"에 이벤트를 발생시킨다.
    console.log('[server.js] on "disconnecting"');
    
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket["nickname"], getRoomSize(room)-1);
    });
  });

  socket.on("disconnect", () => { // socket.io 제공 이벤트 중 하나. 소켓 접속이 끊어지는것을 감지하고, 끊어진 "직후"에 이벤트를 발생시킨다.
    console.log('[server.js] on "disconnect"');
    
    wsServer.sockets.emit("room_changed", getPublicRooms()); 
  })

  socket.on("nickname", (nickname) => {
    console.log('[server.js] on "nickname"');
    socket["nickname"] = nickname;
  })
});

function getPublicRooms() {
  console.log('[server.js] in "getPublicRooms()"');

  const {rooms, sids} = wsServer.sockets.adapter;
  const publicRooms = [];
  
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  })

  return publicRooms;
}

function getRoomSize(roomName) {
  console.log('[server.js] in "getRoomSize()"');
  
  const {rooms} = wsServer.sockets.adapter;
  
  return rooms.get(roomName).size;
}

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
