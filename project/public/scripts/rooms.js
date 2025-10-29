
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

    socket.emit("request-active-rooms")

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

socket.on("failed-to-create-room", ()=>{

    alert("Failed to create room. Please try again.")

})

socket.on("already-in-room", ()=>{

    alert("You are already in that room.")

})

socket.on("server-active-rooms", (roomsData)=>{

    let addedHTML = ""

    for (let i = 0; i < roomsData.length; i++){

        addedHTML += `<h1>Room code: ${roomsData[i]["room code"]}&nbsp;&nbsp;
        User count: ${roomsData[i]["user count"]}&nbsp;&nbsp;
        Host: ${roomsData[i]["host"]}</h1>`

    }

    document.getElementById("rooms").innerHTML = addedHTML;

})

function searchRoom(){

    var roomCode = document.getElementById("inputROOMCODE").value;

    socket.emit("search-room", roomCode)

}

function createRoom(){

    socket.emit("createRoom")

}
