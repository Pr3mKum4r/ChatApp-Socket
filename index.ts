import { Server } from "socket.io";

const io = new Server({ cors: { origin: "*" }});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("New client connected with id: " + socket.id);

  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ 
        userId, 
        socketId: socket.id 
    });
    console.log(onlineUsers);

    io.emit("emitOnlineUsers", onlineUsers);
  });

  socket.on("sendMessage", (message) =>{
    const user = onlineUsers.find((user) => user.userId === message.receiverId);
    if(user){
      io.to(user.socketId).emit("getMessage", message);
    }
  })

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("emitOnlineUsers", onlineUsers);
  });
});



io.listen(3000);