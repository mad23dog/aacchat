// server.js
const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  
  ws.on('message', (message) => {
    for(const client of clients) {
      if(client.readyState === ws.OPEN) {
        client.send(message.toString());
      }
    }
  });
  
  ws.on('close', () => clients.delete(ws));
});
