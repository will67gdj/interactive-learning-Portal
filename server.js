const express = require("express");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, "public")));

const clients = new Map(); // Store each user's color

wss.on("connection", (ws) => {
  console.log("A user connected");

  // Generate a random color for the user
  const color = "#" + Math.floor(Math.random() * 16777215).toString(16);

  // Save the user’s color
  clients.set(ws, { color });

  ws.on("message", (msg) => {
    let data = JSON.parse(msg);

    // Attach the user’s color
    data.color = clients.get(ws).color;

    // Broadcast to all users
    const json = JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(json);
      }
    });
  });

  ws.on("close", () => {
    console.log("A user disconnected");
    clients.delete(ws);
  });
});

// Render uses PORT — default to localhost:10000
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
