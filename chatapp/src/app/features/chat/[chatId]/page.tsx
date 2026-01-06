'use client'

import axios from '@/lib/axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import { FaPaperPlane, FaUserCircle } from 'react-icons/fa'
import { io, Socket } from 'socket.io-client'

const socket: Socket = io('https://chat-app-six-liard-14.vercel.app', {
    transports: ['websocket']
})

interface IUser {
  _id: string
  username: string
}

interface IMessage {
   senderId: string
   receiverId: string
   chatId: string
   text: string
}

const ChatPage = () => {
  const { chatId } = useParams()
  const router = useRouter()
  const [receiver, setReceiver] = useState<IUser | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<IMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const senderId = localStorage.getItem('userId')
    if (!senderId) {
      router.push('/features/auth/login')
      return
    }

    setCurrentUserId(senderId)

    const fetchChat = async () => {
      try {
        const res = await axios.get(`/chat/${chatId}`)
        const otherUser = res.data.members.find(
          (user: IUser) => user._id !== senderId
        )
        setReceiver(otherUser)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchChat()
  }, [chatId, router])

  useEffect(() => {
    if (!currentUserId) return;

    socket.emit('addUser', currentUserId)

    socket.on('getMessage', (data: IMessage) => {
      setMessages(prev => [...prev, data])
    })

    return () => {
      socket.off('getMessage')
    }
  }, [currentUserId])

  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/message/getMessages/${chatId}`)
        setMessages(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchMessages()
  }, [chatId])

  const handleSendMessage = async () => {
    if (!message.trim() || !receiver || !currentUserId) return

    const msgData: IMessage = {
      senderId: currentUserId,
      receiverId: receiver._id,
      chatId: chatId as string,
      text: message
    }

    socket.emit('sendMessage', msgData)

    try {
      await axios.post('/message/postMessage', msgData)
    } catch (err: any) {
      console.log(err)
    }

    setMessages(prev => [...prev, msgData])
    setMessage('')
  }

  if (!currentUserId || loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-white bg-[#0f0f0f]">
        Loading chat...
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] flex flex-col items-center px-2 pt-24 pb-6">
      <div className="w-full max-w-5xl h-[90vh] bg-[#1a1a1a] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4 px-6 py-4 border-b border-gray-700 bg-[#1f1f1f]">
          <div className="flex items-center gap-4">
            <FaUserCircle className="text-5xl md:text-6xl text-gray-400" />
            <div className="flex flex-col">
              <span className="text-white font-semibold text-lg md:text-xl truncate max-w-xs">
                {receiver?.username || 'Loading...'}
              </span>
              <span className="text-green-400 text-sm md:text-md flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Online
              </span>
            </div>
          </div>
          <div className="hidden md:flex text-gray-400 text-sm">
            Chat ID: {chatId}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-xs px-4 py-2 rounded-xl break-words whitespace-pre-wrap overflow-hidden ${
                msg.senderId === currentUserId
                  ? 'bg-indigo-600 ml-auto text-white'
                  : 'bg-gray-700 mr-auto text-white'
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        <div className="px-4 py-3 border-t border-gray-700 bg-[#1a1a1a]">
          <div className="flex items-center gap-3 bg-[#262626] rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSendMessage() }}
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
            />
            <button
              className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 transition text-white p-3 rounded-full flex items-center justify-center"
              onClick={handleSendMessage}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ChatPage
