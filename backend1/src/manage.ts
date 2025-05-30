import { WebSocket } from 'ws';
import { init_game, MOVE } from './message';
import { Game } from './game';

export class Manage {
    private games: Game[];
    private users: WebSocket[];
    private pendingUsers: WebSocket[] | null;

    constructor(){
        this.games = [];
        this.users = [];
        this.pendingUsers = [];
    }

    addUser(socket: WebSocket){
        this.users.push(socket);  
        this.handle(socket);
    }


    removeUser(socket: WebSocket){
        this.users = this.users.filter(user => user !== socket);
    }

    private handle(socket: WebSocket) {
    socket.on("message", (data) => {
        try {
            const message = JSON.parse(data.toString());
            console.log("Received message:", message);
            
            if (message.type === init_game) {
                console.log("Init game message received");
                if (this.pendingUsers && this.pendingUsers.length > 0) {
                    const opponent = this.pendingUsers.shift()!;
                    console.log("Found an opponent, creating game");
                    const game = new Game(opponent, socket);
                    this.games.push(game);
                    console.log(`Game created. Total games: ${this.games.length}`);
                } else {
                    console.log("No opponents available, adding to pending queue");
                    this.pendingUsers!.push(socket);
                    console.log(`User added to pending queue. Pending users: ${this.pendingUsers!.length}`);
                }
            } else if (message.type === MOVE) {
                console.log(`Move requested: ${message.payload.from} to ${message.payload.to}`);
                const game = this.games.find(g => g.player1 === socket || g.player2 === socket);
                if (game) {
                    console.log("Game found, making move");
                    game.makeMove(socket, message.payload);
                } else {
                    console.error("Game not found for the move");
                    socket.send(JSON.stringify({
                        type: "error",
                        payload: { message: "No active game found" }
                    }));
                }
            }
        } catch (error) {
            console.error("Error handling message:", error);
            socket.send(JSON.stringify({
                type: "error",
                payload: { message: "Invalid message format" }
            }));
        }
    });
    
    socket.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
    }
}