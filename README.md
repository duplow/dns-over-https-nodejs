# dns-over-https-nodejs

A simple DNS Server that proxies to DoH(DNS over HTTPS) written in Node.js

### Next features

- Support HTTP/2 for speed up multiple requests

### How to setup

Create a `.env` file in your project folder and configure the `DNS_SERVER_PORT` and `DNS_SERVER_BIND_ADDRESS`

```sh
cp .sample.env .env
```

Install dependencies

```sh
npm install
```

Run server

```sh
npm start
```
