const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } 
});

io.on('connection', (socket) => {
  console.log(`User masuk: ${socket.id}`);

  // Terima garis dari satu HP, lempar ke semua HP lain
  socket.on('send-trace', (data) => {
    socket.broadcast.emit('receive-trace', data);
  });

  // Terima perintah hapus, lempar ke semua HP lain
  socket.on('send-clear', () => {
    socket.broadcast.emit('receive-clear');
  });

  socket.on('disconnect', () => {
    console.log(`User keluar: ${socket.id}`);
  });
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Backend nyala dan terbuka untuk jaringan lokal di port 3000');
});