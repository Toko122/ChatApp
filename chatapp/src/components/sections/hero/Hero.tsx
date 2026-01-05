'use client'

import React, { ChangeEvent, useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import axios from '@/lib/axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import './Hero.css'

interface IUser {
  _id: string
  username: string
}

const Hero = () => {

     const [users, setUsers] = useState<IUser[]>([])
     const [searchValue, setSearchValue] = useState('')
     const [currentUserId, setCurrentUserId] = useState<string | null>(null)
     const router = useRouter()

     useEffect(() => {

       const senderId = localStorage.getItem('userId')
         if (!senderId) {
         router.push('/features/auth/login')
         return
        }
       setCurrentUserId(senderId) 

       const fetchUsers = async () => {
        try {
        const res = await axios.get('/users/getAllUsers')
        setUsers(res.data.users)
         } catch (err) {
          console.log(err)
         }
      }
    fetchUsers()
  }, [router])

    const filteredUsers = users.filter((user) => 
       user.username.toLowerCase().includes(searchValue.toLowerCase())
       
    ).filter((user) => user._id !== currentUserId)

     

  return (
    <div className='bg-[#1a1a1a] w-full min-h-screen overflow-x-hidden'>
      <div className='w-full min-h-screen flex items-center justify-center text-center'>
        <div className='flex flex-col gap-8 pb-24'>

          <div className='flex flex-col gap-6 max-w-3xl px-4'>
            <h1 className='HeroHeader text-white text-5xl md:text-6xl lg:text-7xl font-bold leading-tight'>
              Discover People.<br />
              Start Real Conversations.
            </h1>

            <p className='HeroP text-gray-400 text-lg md:text-xl'>
              Search users, connect instantly, and chat without limits — all in one place.
            </p>
          </div>

          <div className='flex justify-center px-4'>
            <div className='w-full max-w-xl relative'>
              <Search className='HeroInput absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />

              <input
                type='text'
                value={searchValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
                placeholder='Search users...'
                className='HeroInput w-full bg-[#111] text-white pl-12 pr-4 py-4 rounded-2xl outline-none
                    border border-[#2a2a2a]
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                    transition-all duration-300'
              />

               {searchValue && (
                <div className='absolute mt-3 w-full bg-[#111] border border-[#2a2a2a] rounded-2xl overflow-y-auto'>
                  {filteredUsers.length ? (
                    filteredUsers.map((user) => (
                      <div key={user._id} className='flex justify-between px-4 items-center'>
                          <div
                          className='px-4 py-3 text-white text-left hover:bg-[#1f1f1f]'
                        >
                          {user.username}
                        </div>

                         <button
                          onClick={async () => {
                            try {
                              const res = await axios.post('/chat/createChat', {
                                 senderId: currentUserId,
                                 receiverId: user._id,
                               })

                               router.push(`/features/chat/${res.data._id}`)
                            } catch (err) {
                              console.log(err)
                           }                          
                          }}
                          className='bg-[#515151] cursor-pointer rounded-[20px] px-4 py-2 text-[14px] hover:bg-[#3b3b3b] text-white transition duration-300'>
                            Create Chat
                        </button>

                      </div>
                    ))
                  ) : (
                    <div className='px-4 py-3 text-gray-400'>
                      No users found
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Hero
