const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.EXPO_PUBLIC_CLIENT_URL || '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const rooms = new Map();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('create-room', () => {
    const roomId = Math.random().toString(36).substring(2, 9).toUpperCase();
    rooms.set(roomId, { host: socket.id, peers: new Set([socket.id]) });
    socket.join(roomId);
    socket.emit('room-created', roomId);
  });

  socket.on('join-room', (roomId) => {
    const room = rooms.get(roomId);
    if (room) {
      room.peers.add(socket.id);
      socket.join(roomId);
      socket.to(roomId).emit('peer-joined', socket.id);
      socket.emit('room-joined', roomId);
    } else {
      socket.emit('error', 'Room not found');
    }
  });

  socket.on('offer', ({ roomId, offer }) => {
    socket.to(roomId).emit('offer', { peerId: socket.id, offer });
  });

  socket.on('answer', ({ roomId, answer }) => {
    socket.to(roomId).emit('answer', { peerId: socket.id, answer });
  });

  socket.on('ice-candidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('ice-candidate', { peerId: socket.id, candidate });
  });

  socket.on('disconnect', () => {
    rooms.forEach((room, roomId) => {
      if (room.peers.has(socket.id)) {
        room.peers.delete(socket.id);
        if (room.peers.size === 0) {
          rooms.delete(roomId);
        } else {
          socket.to(roomId).emit('peer-left', socket.id);
        }
      }
    });
  });
});

// Endpoint to get ICE servers from Twilio
app.get('/ice-servers', async (req, res) => {
  try {
    const token = await client.tokens.create();
    res.json(token.iceServers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ICE servers' });
  }
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
