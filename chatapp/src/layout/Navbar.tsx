'use client'

import { useAuth } from '@/lib/Auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Navbar = () => {

     const {isLoggedIn, logout} = useAuth()
     const router = useRouter()

     const handleLogout = () => {
         logout()
         router.push('/features/auth/login')
     }
  return (
    <div className='w-full bg-black shadow-2xl min-h-[80px] fixed top-0 flex items-center'>
         <div className='w-full flex items-center justify-between px-12'>
              <Link href={'/'} className='text-white text-2xl'>ChatApp</Link>

             {
                isLoggedIn ? (
                  <div onClick={handleLogout} className='bg-white rounded-[20px] py-1.5 px-4 text-black text-[16px] cursor-pointer'>
                       Logout
                  </div>
                ) : (
                   <Link href={'/features/auth/login'} className='bg-white rounded-[20px] py-1.5 px-4 text-black text-[16px] cursor-pointer'>
                       Login
                  </Link>
                )
             }

         </div>
    </div>
  )
}

export default Navbar