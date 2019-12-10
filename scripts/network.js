// класс GameClient предназначен для передачи информации между игроками
export class GameClient {
    host =  "localhost:8090";
    socket = new WebSocket("ws://"+host+"/chat/server.php");

    constructor(name){
        this.username = name;
    }
    

    get newClientPromise() {
      return new Promise((resolve, reject) => {
        let socket = new WebSocket("ws://demos.kaazing.com/echo");
        console.log(socket)
        socket.onopen = () => {
          console.log("connected");
          resolve(socket);
        };
        socket.onerror = error => reject(error);
      })
    }
    get clientPromise() {
      if (!this.promise) {
        this.promise = this.newClientPromise
      }
      return this.promise;
    }
  }
/* function GameClient() {
    // типы сообщений, отправляемых серверу
    var REQUEST_FOR_GAME = 0,
        NEW_MOVE = 1;


    

    var self = this;


    socket.onopen = function(){
        var state = document.getElementById("connection-state");
        state.innerHTML = "connection established";
        if (state.classList.contains("disconnected"))
            state.classList.remove("disconnected");
        state.classList.add("connected");
    }

    socket.onclose = function(){
        var state = document.getElementById("connection-state");
        state.innerHTML = "connection lost";
        if (state.classList.contains("connected"))
            state.classList.remove("connected");
        state.classList.add("disconnected");
    }

    socket.onerror = function(){
        var state = document.getElementById("connection-state");
        state.innerHTML = "connection lost";
        if (state.classList.contains("connected"))
            state.classList.remove("connected");
        state.classList.add("disconnected");
    }

    socket.onmessage = function(event){
        var data = JSON.parse(event.data);
        var state = document.getElementById("connection-state");
        state.innerHTML = event.data;
    }

    // отправка данных серверу
    this.sendData = function(username, datatype, userdata){
        var message = {
            user:username,
            type:datatype,
            data:userdata
        }
        console.dir(message);
        // if(!socket.readyState){
        //     setTimeout(function (){
        //         self.sendData(username, datatype, userdata);
        //     },1000);
        // }
        // else{
            socket.send(JSON.stringify(message));
        // }
        
    }

    this.sendData(username, REQUEST_FOR_GAME, {}); */
// }