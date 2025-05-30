import {WebSocket} from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, MOVE, init_game } from "./message";

export class Game {
    public player1: WebSocket | null = null;
    public player2: WebSocket | null = null;
    private board: Chess | null = null;
    private startTime: Date;
    private moveCount = 0;

    constructor(player1: WebSocket, player2: WebSocket | null = null) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess(); 
        this.startTime = new Date();
        
        console.log("Initializing game - sending color information to players");
        
        this.player1?.send(JSON.stringify({
            type: init_game,
            payload: {
                color: 'white',
            }
        }));
        
        this.player2?.send(JSON.stringify({
            type: init_game,
            payload: {
                color: 'black',
            }
        }));
    }

    makeMove(socket: WebSocket, move: {
        from: string,
        to: string,
    }) {
        console.log(`Move attempt from ${socket === this.player1 ? "player1" : "player2"}: ${move.from} to ${move.to}`);
        
        if (!this.board) {
            return console.error("Board is not initialized");
        }
        
        // Check if it's the right player's turn
        if (this.moveCount % 2 === 0 && this.player1 !== socket) {
            console.error("It's player1's turn");
            return;
        }
        if (this.moveCount % 2 === 1 && this.player2 !== socket) {
            console.error("It's player2's turn");
            return;
        }

        try {
            // Make the move on the board
            const result = this.board.move(move);
            console.log("Move made successfully:", result);
            
            // Send the move to the other player
            if (socket === this.player1) {
                console.log("Sending move to player2");
                this.player2?.send(JSON.stringify({
                    type: MOVE,
                    payload: move
                }));
            } else {
                console.log("Sending move to player1");
                this.player1?.send(JSON.stringify({
                    type: MOVE,
                    payload: move
                }));
            }
            
            // Increment move counter
            this.moveCount++;
            
            // Check for game over
            if (this.board.isGameOver()) {
                const winner = this.board.turn() === 'w' ? 'black' : 'white';
                console.log("Game over! Winner:", winner);
                
                const gameOverMessage = JSON.stringify({
                    type: GAME_OVER,
                    payload: {
                        winner: winner,
                    }
                });
                
                this.player1?.send(gameOverMessage);
                this.player2?.send(gameOverMessage);
            }
            
        } catch (e) {
            console.error("Invalid move:", e);
            // Send error back to the player
            socket.send(JSON.stringify({
                type: "error",
                payload: { message: "Invalid move" }
            }));
        }
    }
}