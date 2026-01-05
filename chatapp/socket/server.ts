import { Server } from "socket.io";
import http from 'http'

const httpServer = http.createServer()

const io = new Server(httpServer, {
     cors: {
        origin: 'https://chat-app-tr8x.vercel.app',
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

httpServer.listen(5000, () => {
  console.log('🔥 Socket.IO server running on http://localhost:5000')
})