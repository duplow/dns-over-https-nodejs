import { networkInterfaces } from 'node:os';
import dgram from 'node:dgram';
import axios from 'axios';

const nets = networkInterfaces();
const server = dgram.createSocket('udp4');

console.log(nets)

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg.toString('utf-8')} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(process.env.DNS_PORT, process.env.DNS_BIND_ADDRESS);