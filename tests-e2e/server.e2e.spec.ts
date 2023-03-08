import dgram from 'node:dgram'
import { createServer } from '../src/server'

const dnsServerOptions = {
  address: '127.0.0.1',
  port: 5354
}

let dnsServer = null
let dnsClient = null

const waitForMessages = (client, waitingTime = 10000) => {
  const messages = []

  return new Promise((resolve, _reject) => {
    client.on('message', (message) => {
      console.log('Message received', message)
      messages.push(message)
    })

    setTimeout(() => {
      resolve(messages)
    }, waitingTime)
  })
}

beforeAll(async () => {
  dnsServer = createServer(dnsServerOptions)
  dnsClient = dgram.createSocket('udp4')
  dnsClient.bind()

  const waitReadyPromise = new Promise((resolve, reject) => {
    dnsServer.on('ready', () => {
      resolve(true)
    })
  
    dnsServer.on('error', (err) => {
      reject(err)
    })

    setTimeout(() => {
      reject('DNS server inicialization timeout')
    }, 10000)
  })

  dnsServer.start()
  await waitReadyPromise
})


afterAll(() => {
  dnsServer.close()
  dnsClient.close()
})

describe('DNS Server', () => {
  test('test query and response', async () => {
    const messagesPromise = waitForMessages(dnsClient)
    dnsClient.send('Standard query BYTE A google.com', dnsServerOptions.port, dnsServerOptions.address)

    const messages = await messagesPromise

    expect(messages).toBeDefined()
    expect(messages).not.toHaveLength(0)
  })
})
