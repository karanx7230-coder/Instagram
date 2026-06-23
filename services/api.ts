import axios from "axios";
export const API = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});
export const APIpic = axios.create({
  baseURL: "https://picsum.photos",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});