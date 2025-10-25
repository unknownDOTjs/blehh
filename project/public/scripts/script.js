
const socket = io();

var localToken = localStorage.getItem("token");
var localUsername = localStorage.getItem("username");

socket.emit("connection-protocal", localToken)

socket.on("log-user-in", (givenToken, givenUsername)=>{

    localStorage.setItem("username", givenUsername)
    localStorage.setItem("token", givenToken)

    console.log(`You have logged in. Username ${givenUsername}, token: ${givenToken}`)

    window.location = "rooms.html";

})

socket.on("failed-login", (loginMessage)=>{

    if (!loginMessage[0]){

        document.getElementById("error").innerHTML = loginMessage[1];

    }

    else{

        document.getElementById("error").innerHTML = ""

    }

})

function sendLoginDetails(){

    var username = document.getElementById("inputUSERNAME").value;
    var password = document.getElementById("inputPASSWORD").value;

    socket.emit("login-details", username, password);

}
