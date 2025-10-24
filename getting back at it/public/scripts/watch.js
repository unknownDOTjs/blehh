
const socket = io();

var localToken = localStorage.getItem("token");
var localUsername = localStorage.getItem("username");
var localRooms = localStorage.getItem("active-rooms");
var isInRoom = false;

socket.on("established-connection", ()=>{

    socket.emit("connection-protocal", localToken)

})

socket.on("log-user-in", (givenToken, givenUsername)=>{

    localStorage.setItem("username", givenUsername)
    localStorage.setItem("token", givenToken)

    console.log(`You have logged in. Username ${givenUsername}, token: ${givenToken}`)

    joinRoom()

})

socket.on("expired-token-protocal", ()=>{

    alert("Invalid token")
    localStorage.clear();
    window.location = "index.html";

})

socket.on("user-successfully-joined-room", (roomData)=>{

    isInRoom = true;
    alert(`Welcome to room ${roomData["room code"]}`)

    updateUsersList(roomData)

})

socket.on("update-user-list", (roomData)=>{

    updateUsersList(roomData)

    alert("update");

})

function joinRoom(){

    alert("joining room...")

    const roomCode = String(window.location.href).replace("http://localhost:3000/watch.html#", "")
    socket.emit("joinRoom", roomCode)

    setTimeout(()=>{

        if (!isInRoom){

            alert("There was a problem joining the room");
            window.location = "rooms.html"

        }

    }, 10000)

}

function updateUsersList(roomData){

    let usersContainerReference = document.getElementById("usersContainer");

    let addedHTML = "";

    for (let i = 0; i < roomData["active-users"].length; i++){

        addedHTML += `<h2 id = "${roomData["active-users"][i]}">${String(roomData["active-users"][i])}</h2>`;

    }

    usersContainerReference.innerHTML = addedHTML;

}