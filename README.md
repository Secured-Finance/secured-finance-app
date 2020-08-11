# Secured Finance App

[![badge](https://img.shields.io/badge/submit%20for-HackFS-blue)](https://hack.ethglobal.co/showcase/secured-finance-recTkx6c1RDoLeaQm)

This repo contains a decentralized web application.

## Quick Start

1. Set environment variables in `.env` file, check `.env.sample` in `app`
2. In the terminal `cd app`, then `npm install`
3. `npm start`

## Domains 
you need to install unstoppable domain [browser extension](https://chrome.google.com/webstore/detail/unstoppable-extension/beelkklmblgdljamcmoffgfbdddfpnnl?hl=en) for `.crypto`
- https://securedfinance.on.fleek.co/
- https://securedfinance.crypto


## Sections of the app

- MoneyMarket
- Swap
- FX
- Books
- History
- Filecoin Page
- Decentralized chat - work in progress

## Technologies used

- ReactJS framework
- React router
- NodeJS
- Web3js to integrate with smart contracts
- Metamask
- Powergate
- Slate
- Pinata cloud
- Filecoin
- Textile bucket/threadb

## Deploy

Deployed to ipfs using Fleek.
Set environment variables below on Fleek:
- `REACT_APP_IS_DEV` - set to `false` on production
- `REACT_APP_PINATA_API_KEY` - your Pinata Cloud API key
- `REACT_APP_PINATA_SECRET_API_KEY` - your Pinata Cloud secret API key
- `REACT_APP_MONEYMARKET_ADDRESS` - MoneyMarket smart contract address
- `REACT_APP_FX_ADDRESS` - FX smart contract address
- `REACT_APP_LOAN_ADDRESS` - Loan smart contract address
