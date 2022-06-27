# Secured Finance App

[![badge](https://img.shields.io/badge/submit%20for-HackFS-blue)](https://hack.ethglobal.co/showcase/secured-finance-recTkx6c1RDoLeaQm) [![badge](https://img.shields.io/badge/submit%20for-ETHOnline-ffe4b4)](https://hack.ethglobal.co/showcase/secured-finance-recJiyE8KWrV5VyHi)

This repo contains a decentralized web application.

## Quick Start

1. Clone this repository
2. Login on the GitHub npm package repository with `npm login --registry=https://npm.pkg.github.com`
3. Install all required dependencies using `npm install` command
4. Run `npm run start` to start development mode

### Recommended Development Environment
This repository provides a `.vscode/settings.json` which assumes you have the following extensions installed:
- ESLint
- Prettier
- TailwindCSS Intellisense
- Code Spell Checker

Those extensions helps streamline the development process by creating a standard way of formatting the code.

## Test the app
The web application is tested in multiple ways
### Unit test
- Run `npm run test`
### Running locally the End to End tests with the interactive runner
You can find more information about the test runner [here](https://docs.cypress.io/guides/core-concepts/test-runner#Clicking-on-Commands)
- Create a file `cypress.env.json` at the root of the project. Please refer to `cypress.env.json.sample` for the list of environment variables needed
- Start the development server with `npm run start`
- start the cypress interactive runner with `npm run cypress:open`
- click on the spec to run it or all the specs

### Running locally the End to End test with the headless runner
This headless runner is a command line runner used for our continuous integration.
- Create a file `cypress.env.json` at the root of the project. Please refer to `cypress.env.json.sample` for the list of environment variables needed
- Start the development server with `npm run start`
- start the cypress headless runner with `npm run cypress:run`
## Domains
you need to install unstoppable domain [browser extension](https://chrome.google.com/webstore/detail/unstoppable-extension/beelkklmblgdljamcmoffgfbdddfpnnl?hl=en) for `.crypto`
- https://securedfinance.on.fleek.co/
- https://securedfinance.crypto


## Sections of the app

- Lending
- Swap
- FX
- History

## Technologies used

- NextJs
- Jest
- Storybook
- TailwindCSS
- Redux
- Web3js to integrate with smart contracts
- Metamask
- Filecoin

## Architectures used

- [Atomic Design](https://atomicdesign.bradfrost.com/table-of-contents/)

## Deployment

Deployed to ipfs using Fleek.

# License

This project is licensed under the MIT license, Copyright (c) 2020 Secured Finance. For more information see `LICENSE.md`.
