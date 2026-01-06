import { Server } from "socket.io";
import http from 'http'

const httpServer = http.createServer()

const PORT = process.env.PORT || 5000;

const io = new Server(httpServer, {
     cors: {
        origin: '*',
        methods: 'GET POST'
     }
})

const users = new Map<string, string>()

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('addUser', (userId: string) => {
    users.set(userId, socket.id)
    console.log('Users:', users)
  })

  socket.on('sendMessage', (data) => {
    const receiverSocketId = users.get(data.receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('getMessage', data)
    }
  })

  socket.on('disconnect', () => {
    for (const [key, value] of users.entries()) {
      if (value === socket.id) users.delete(key)
    }
    console.log('User disconnected')
  })
})

httpServer.listen(PORT, () => {
  console.log('Socket.IO server running on https://chatapp-3jtw.onrender.com')
})