# dns-over-https-nodejs

A simple DNS standard server that proxies to DoH(DNS over HTTPS) written in Node.js

### Next steps

- Add support to HTTP/2 for speed up multiple requests
- Translate code to `Rust` or `GoLang` for performance

### How to setup

Create a `.env` file in your project folder and configure the `DNS_SERVER_PORT`, `DNS_SERVER_BIND_ADDRESS` and `DNS_SERVER_QUERY_ADDRESS`

```sh
cp .sample.env .env
```

Install dependencies

```sh
yarn install
```

yarn server

```sh
yarn start
```

Run tests
```sh
yarn test
```
