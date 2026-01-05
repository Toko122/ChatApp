import axios, { InternalAxiosRequestConfig } from "axios";

const instance = axios.create({
    baseURL: 'https://chat-az1hw9gao-toko122s-projects.vercel.app/api'
})

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token')
        : null

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  }
)

export default instance