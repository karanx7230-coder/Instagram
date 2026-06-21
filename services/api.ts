import axios from "axios";
export const API = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});
// https://picsum.photos/400/400?random=${id}