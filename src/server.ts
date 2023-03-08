import dgram from 'node:dgram'
import { EventEmitter } from 'events'
import { createDoHClient } from './doh-client'

export type DnsServerOptions = {
  address?: string
  port?: number
  queryAddress?: string
}

export const createServer = (options: DnsServerOptions) => {
  const udp = dgram.createSocket('udp4')
  const doh = createDoHClient({ address: options.queryAddress || '1.1.1.1' })
  const eventEmitter = new EventEmitter()
  
  let isDoHClientReady = false
  let isServerListening = false

  eventEmitter.on('up', (service) => {
    if (isDoHClientReady && isServerListening) {
      eventEmitter.emit('ready')
    }
  })

  eventEmitter.on('ready', () => {
    console.log('DNS server ready for receive messages!')
  })

  doh.on('ready', () => {
    console.log('DoH is ready!')
    isDoHClientReady = true
    eventEmitter.emit('up', 'DoH')
  })

  udp.on('error', (err) => {
    console.error(`DNS server error:\n${err.stack}`)
    udp.close()
  });

  udp.on('message', (msg, rinfo) => {
    const content = msg.toString('utf-8')
    console.log(`server got: ${content} from ${rinfo.address}:${rinfo.port}`)

    if (content.startsWith('Standard query')) {
      doh.query('google.com', (err, data)  => {})
      console.log('Standard query response BYTE XXXX')
    }
  });

  udp.on('listening', () => {
    console.log('DNS server is ready!')
  
    const address = udp.address()
    console.log(`server listening ${address.address}:${address.port}`)
    isServerListening = true
    eventEmitter.emit('up', 'UDP')
  });

  return {
    on: function (eventName, listener) {
      eventEmitter.on(eventName, listener)
      return this
    },
    start: function () {
      udp.bind(options.port || 53, options.address)
      return this
    },
    close: function () {
      udp.close()
      return this
    }
  }
}