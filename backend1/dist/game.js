"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const message_1 = require("./message");
class Game {
    constructor(player1, player2 = null) {
        var _a, _b;
        this.player1 = null;
        this.player2 = null;
        this.board = null;
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        console.log("Initializing game - sending color information to players");
        (_a = this.player1) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
            type: message_1.init_game,
            payload: {
                color: 'white',
            }
        }));
        (_b = this.player2) === null || _b === void 0 ? void 0 : _b.send(JSON.stringify({
            type: message_1.init_game,
            payload: {
                color: 'black',
            }
        }));
    }
    makeMove(socket, move) {
        var _a, _b, _c, _d;
        // Add guard clause to prevent undefined errors
        if (!move || typeof move.from !== "string" || typeof move.to !== "string") {
            console.error("Invalid move object received:", move);
            socket.send(JSON.stringify({
                type: "error",
                payload: { message: "Invalid move object" }
            }));
            return;
        }
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
            // Send the move to both players
            (_a = this.player1) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
                type: message_1.MOVE,
                payload: move
            }));
            (_b = this.player2) === null || _b === void 0 ? void 0 : _b.send(JSON.stringify({
                type: message_1.MOVE,
                payload: move
            }));
            // Increment move counter
            this.moveCount++;
            // Check for game over
            if (this.board.isGameOver()) {
                const winner = this.board.turn() === 'w' ? 'black' : 'white';
                console.log("Game over! Winner:", winner);
                const gameOverMessage = JSON.stringify({
                    type: message_1.GAME_OVER,
                    payload: {
                        winner: winner,
                    }
                });
                (_c = this.player1) === null || _c === void 0 ? void 0 : _c.send(gameOverMessage);
                (_d = this.player2) === null || _d === void 0 ? void 0 : _d.send(gameOverMessage);
            }
        }
        catch (e) {
            console.error("Invalid move:", e);
            // Send error back to the player
            socket.send(JSON.stringify({
                type: "error",
                payload: { message: "Invalid move" }
            }));
        }
    }
}
exports.Game = Game;
