import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.VUE_APP_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default instance