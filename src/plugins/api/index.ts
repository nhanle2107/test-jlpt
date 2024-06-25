import axios from "axios";
import { App } from "vue";

const api = axios.create({
  baseURL: 'https://jlpt.mazii.net/api/',
  headers: {
    "Content-Type": "application/json"
  }
})

export default function(app: App) {
  app.use(api)
}

export { api }
