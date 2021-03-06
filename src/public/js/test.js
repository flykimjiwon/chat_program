// eslint-disable-next-line no-undef
const socket = io();

const welcome = document.getElementById("welcome");
const enterForm = welcome.querySelector("form");
const room = document.getElementById("room");

let roomName;

room.hidden = true;

const addMessage = (message) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.append(li);
};

const handleNicknameSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector("#name input");
  socket.emit("nickname", input.value);
};

const handleMessageSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  // const { value } = input;
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
};

const showRoom = () => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  room.hidden = false;
  welcome.hidden = true;
  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#name");
  msgForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNicknameSubmit);
};

const handleRoomSubmit = (event) => {
  const roomNameInput = enterForm.querySelector("#roomName");
  const nickNameInput = enterForm.querySelector("#name");
  event.preventDefault();
  socket.emit("enter_room", roomNameInput.value, nickNameInput.value, showRoom);
  roomName = roomNameInput.value;
  roomNameInput.value = "";
  const changeNameInput = room.querySelector("#name input");
  changeNameInput.value = nickNameInput.value;
};

enterForm.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user,newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${user} joined the room`);
});

socket.on("bye", (user,newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${user} left!`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms)=>{
  
  const roomList = welcome.querySelector("ul")
  roomList.innerHTML=""
  if( rooms.length ===0){
    return
  }
  rooms.forEach(room=>{
    const li = document.createElement("li")
    li.innerText = room
    roomList.append(li)
  })
});

// socket.on("room_change",(msg)=> console.log(msg));

