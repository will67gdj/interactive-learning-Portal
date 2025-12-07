const express = require("express");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Store user colors
const clients = new Map();

wss.on("connection", (ws) => {
    console.log("User connected");

    // random color for each user
    const color = "#" + Math.floor(Math.random() * 16777215).toString(16);

    clients.set(ws, { color });

    ws.on("message", (msg) => {
        const data = JSON.parse(msg);

        data.color = clients.get(ws).color;

        const json = JSON.stringify(data);

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(json);
            }
        });
    });

    ws.on("close", () => {
        clients.delete(ws);
        console.log("User disconnected");
    });
});

const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
