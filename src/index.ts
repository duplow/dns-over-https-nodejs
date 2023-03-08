import { createServer } from './server'

const server = createServer({
  address: process.env.DNS_SERVER_BIND_ADDRESS,
  port: parseInt(process.env.DNS_SERVER_PORT),
  queryAddress: process.env.DNS_SERVER_QUERY_ADDRESS,
})

server.start()
