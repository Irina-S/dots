// класс GameClient предназначен для передачи информации между игроками
export function GameClient() {
    var host =  "localhost:8090";
    var socket = new WebSocket("ws://"+host+"/chat/server.php");

    socket.onopen = function(){
        var state = document.getElementById("connection-state");
        state.innerHTML = "connection established";
        if (state.classList.contains("disconnected"))
            state.classList.remove("disconnected");
        state.classList.add("connected");
    }

    socket.onclose = function(){
        state.innerHTML = "connection lost";
        if (state.classList.contains("connected"))
            state.classList.remove("connected");
        state.classList.add("disconnected");
    }

    socket.onerror = function(){
        state.innerHTML = "connection lost";
        if (state.classList.contains("connected"))
            state.classList.remove("connected");
        state.classList.add("disconnected");
    }

    socket.onmessage = function(){

    }

}