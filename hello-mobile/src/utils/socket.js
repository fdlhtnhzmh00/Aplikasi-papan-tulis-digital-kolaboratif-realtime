import { io } from 'socket.io-client';

// Pastikan angka IP ini benar-benar sesuai dengan ipconfig terakhirmu
const BACKEND_URL = "http://192.168.1.6:3000"; 

const socket = io(BACKEND_URL, {
  autoConnect: false,
  transports: ['websocket'], // TAMBAHAN MUTLAK: Paksa bypass proteksi HTTP Android
});

export default socket;