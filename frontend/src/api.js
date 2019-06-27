import openSocket from 'socket.io-client';
const socket = openSocket('https://alpha-admin.herokuapp.com');


export default function subscribeToEvents(cb) {
  socket.on('add device', (data) => cb(null, 'Device added'));
  socket.on('delete device', (data) => cb(null, 'Device deleted'));
  socket.on('toggled power', (data) => cb(null, 'Power toggled'));
  socket.on('fetch devices', (data) => cb(null, data));
  socket.on('load', (data) => cb(null, data));
}
