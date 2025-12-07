const WebSocket = require("ws");

const port = process.env.PORT || 3000;

const wss = new WebSocket.Server({ port });

console.log("Chat server running on port " + port);

wss.on("connection", (ws) => {
    ws.on("message", msg => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg.toString());
            }
        });
    });
});
