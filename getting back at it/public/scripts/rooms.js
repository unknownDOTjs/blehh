
const socket = io();

var localToken = localStorage.getItem("token");
var localUsername = localStorage.getItem("username");
var localRooms = localStorage.getItem("active-rooms")

socket.on("established-connection", ()=>{

    socket.emit("connection-protocal", localToken)

})

socket.on("log-user-in", (givenToken, givenUsername)=>{

    localStorage.setItem("username", givenUsername)
    localStorage.setItem("token", givenToken)

    console.log(`You have logged in. Username ${givenUsername}, token: ${givenToken}`)

})

socket.on("expired-token-protocal", ()=>{

    alert("Invalid token")
    localStorage.clear();
    window.location = "index.html";

})

socket.on("valid-room", (serverRoomCode, joinedRoom)=>{

    localStorage.setItem("active-rooms", serverRoomCode);
    alert(`Joining room...`);
    window.location = `watch.html#${joinedRoom}`;

})

socket.on("invalid-room", ()=>{

    alert("Invalid room code.")

})

socket.on("already-in-room", ()=>{

    alert("You are already in that room.")

})

function searchRoom(){

    var roomCode = document.getElementById("inputROOMCODE").value;

    socket.emit("search-room", roomCode, localRooms)

}

function createRoom(){

    socket.emit("createRoom")

}