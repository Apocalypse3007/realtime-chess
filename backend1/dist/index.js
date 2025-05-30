"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const manage_1 = require("./manage");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const manager = new manage_1.Manage();
console.log("WebSocket server started on port 8080");
wss.on('connection', function connection(ws) {
    console.log("New client connected");
    manager.addUser(ws);
    ws.on("close", () => {
        console.log("Client disconnected");
        manager.removeUser(ws);
    });
});
