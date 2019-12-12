// класс GameClient предназначен для передачи информации между игроками
import {Ws} from './Ws.js';
import {REQUEST_FOR_GAME, NEW_MOVE, COLOR_ASSIGN, ENEMY_ASSIGN, ENEMY_MOVE} from './net-consts.js';
export class GameClient {
    
    
    constructor(name){
        this.username = name;
        this.ws = new Ws();
        this.ws.clientPromise
            .then(socket => {
                this.socket = socket;
                // console.dir(this.socket);
                socket.send(JSON.stringify(this.prepareMsg(0, {})));
                let state = document.getElementById("connection-state");
                state.innerHTML = "connection established";
                if (state.classList.contains("disconnected"))
                    state.classList.remove("disconnected");
                state.classList.add("connected");

                this.socket.onmessage = function(event){
                    let data = JSON.parse(event.data);
                    // let state = document.getElementById("connection-state");
                    // state.innerHTML = event.data;
                    console.dir(data);
                }

            })
            .catch(error => {
                    console.dir(error);
                    let state = document.getElementById("connection-state");
                    state.innerHTML = "connection lost";
                    if (state.classList.contains("connected"))
                        state.classList.remove("connected");
                    state.classList.add("disconnected");
                })
    }
    

    prepareMsg(datatype, userdata){
        let message = {
            user:this.username,
            type:datatype,
            data:userdata
        }
        // console.dir(message);
        return message;
    }

    processMsg(type, data){
        switch (type){
            case COLOR_ASSIGN:{
                if (data=="red"){
                    // устанавливаем красный маркер
                    let move_marker = document.createElement('div');
                    move_marker.className = 'move';
                    document.getElementById('red_player').append(move_marker);
                    // ождиание сторого игрока(синие)
                    document.getElementById("blue_player").innerHTML = "waiting";
                    // ВЫЯСНИТЬ, КТО ИГРАЕТ ПЕРВЫС!!!
                }
                break;
            }
            case ENEMY_MOVE:{
                break;
            }
        }
    }

    // sendData(datatype, userdata){
        
    //     this.socket.send(JSON.stringify(message));
    // }
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