import { io } from "socket.io-client";

// Replace with your backend URL and port
const socket = io('http://localhost:8000');

export default socket;