import socketIOClient from 'socket.io-client';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const connection = socketIOClient(backendUrl);

export default connection;