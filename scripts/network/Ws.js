export class Ws{
    constructor(){
        this.host =  "localhost:8090";
    }

    get newClientPromise() {
        return new Promise((resolve, reject) => {
          let socket = new WebSocket("ws://"+this.host+"/chat/server.php");
          console.log(socket);

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
        console.dir(this.promise);
        return this.promise;
    }
}