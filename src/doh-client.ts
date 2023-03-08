
import axios from 'axios'
import { EventEmitter } from 'events'

export type QueryResponse = {
  Status: number,
  TC: boolean,
  RD: boolean,
  RA: boolean,
  AD: boolean,
  CD: boolean,
  Question: [{
    name: string,
    type: number
  }],
  Answer: [{
    name: string,
    type: number,
    TTL: number,
    data: string
  }]
}

export type DoHClientOptions = {
  address: string
}

export const createDoHClient = (options: DoHClientOptions) => {
  const { address } = options
  const eventEmitter = new EventEmitter()

  const httpClient = axios.create({
    baseURL: `https://${address}`,
    headers: {
      'content-type': 'application/dns-json',
    }
  })

  eventEmitter.once('newListener', () => {
    process.nextTick(() => {
      eventEmitter.emit('ready', true)
    })
  })

  return {
    on: function (eventName, listener) {
      eventEmitter.on(eventName, listener)
      return this
    },
    query: function (address: string, callback) {
      httpClient.post<QueryResponse>('/dns-query', new URLSearchParams({ name: address }).toString())
        .then((data) => {
          // TODO: Reply
          callback(null, data)
        })
        .catch((err) => {
          callback(err)
          console.error(`Failed to resolve DNS ${address}`)
        })
    }
  }
}