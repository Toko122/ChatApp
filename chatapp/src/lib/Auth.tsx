'use client'

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

interface AuhtProviderForm {
   userId: string | null,
   token: string | null,
   isLoggedIn: boolean,
   login: (token: string, userId: string) => void,
   logout: () => void
}

interface JwtPayload {
  exp: number
}

 const AuthContext = createContext<AuhtProviderForm | null>(null)

 interface AuthProviderProps {
    children: ReactNode
 }

const Auth = ({children}: AuthProviderProps) => {
  
    const [token, setToken] = useState<string | null>(null)
    const [userId, setUserId] = useState<string | null>(null)
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

    const login = (token: string, userId: string) => {
          localStorage.setItem('token', token)
          localStorage.setItem('userId', userId)
          setToken(token)
          setUserId(userId)
          setIsLoggedIn(true)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        setToken(null)
        setUserId(null)
        setIsLoggedIn(false)
    }
    
    useEffect(() => {
        const autoLogout = (token: string, userId: string) => {
            const decoded = jwtDecode<JwtPayload>(token)
            const currentTime = Date.now() / 1000
            if(decoded.exp < currentTime){
               logout()
            }else{
               setToken(token)
               setUserId(userId)
               setIsLoggedIn(true)
            }
        }
       const storedToken = localStorage.getItem('token')
       const storedUserId = localStorage.getItem('userId')

       if (storedToken && storedUserId) {
         autoLogout(storedToken, storedUserId)
       }
    }, [])

  return (
    <AuthContext.Provider value={{login, logout, isLoggedIn, token, userId}}>
         {children}
    </AuthContext.Provider>
  )
}

export default Auth

export const useAuth = () => {
   const context = useContext(AuthContext)

   if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context

}