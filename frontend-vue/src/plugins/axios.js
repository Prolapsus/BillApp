import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default {
  install: (app) => {
    // configure the $axios global property
    app.config.globalProperties.$http = { ...axiosInstance }
    // plus tard dans l'application, on pourra utiliser this.$http.get(...)
  }
}
