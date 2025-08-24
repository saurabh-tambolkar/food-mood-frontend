// socket.js
import { io } from "socket.io-client";


// const socket = io("https://food-mood-backend.onrender.com", {
//   withCredentials: true,
// });
const socket = io(process.env.REACT_APP_BASE_URL, {
  withCredentials: true,
});
// console.log(process.env.REACT_APP_BASE_URL)

// const socket = io("http://localhost:5000", {
//   withCredentials: true,
// });

export default socket;

