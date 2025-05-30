import { WebSocketServer } from 'ws';
import { Manage } from './manage';

const wss = new WebSocketServer({ port: 8080 });
const manager = new Manage();

console.log("WebSocket server started on port 8080");

wss.on('connection', function connection(ws) {
  console.log("New client connected");
  manager.addUser(ws);
  
  ws.on("close", () => {
      console.log("Client disconnected");
      manager.removeUser(ws);
  });
});




