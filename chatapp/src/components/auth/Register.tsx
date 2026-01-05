'use client'

import axios from '@/lib/axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { Spinner } from '../ui/spinner'

interface RegisterForm {
  username: string
  email: string
  password: string
}

const Register = () => {
  const [form, setForm] = useState<RegisterForm>({
    username: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await axios.post('/auth/register', form)
      router.push('/features/auth/login')
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Create Account 🚀
        </h2>
        <p className="text-center text-gray-500 mt-2">
          Join the conversation today
        </p>

        {/* Display server error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mt-4 text-center">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-5">
          <div>
            <label className="text-sm text-gray-600">Username</label>
            <input
              name="username"
              onChange={handleChange}
              value={form.username}
              type="text"
              placeholder="yourname"
              className="w-full mt-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              name="email"
              onChange={handleChange}
              value={form.email}
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              name="password"
              onChange={handleChange}
              value={form.password}
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Spinner /> Loading
              </>
            ) : (
              'Register'
            )}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link
            href="/features/auth/login"
            className="text-purple-600 font-semibold cursor-pointer"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Register
