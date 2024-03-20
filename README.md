<div align="center">

<img src="https://assets-global.website-files.com/64083b97a8837a1e7f5a3a33/64083b97a8837a05b25a3a57_logo.svg" width="328" style="margin-bottom: 20px"/>

[![badge](https://img.shields.io/badge/submit%20for-HackFS-blue)](https://hack.ethglobal.co/showcase/secured-finance-recTkx6c1RDoLeaQm) [![badge](https://img.shields.io/badge/submit%20for-ETHOnline-ffe4b4)](https://hack.ethglobal.co/showcase/secured-finance-recJiyE8KWrV5VyHi) ![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/Secured-Finance/secured-finance-app) ![GitHub License](https://img.shields.io/github/license/Secured-Finance/secured-finance-app)

A DeFi Trading Platform utilizing Orderbook-based Rates, facilitating the lending and borrowing of digital assets for constructing yield curves within the DeFi ecosystem.

### Quick Links
[![Static Badge](https://img.shields.io/badge/Homepage-5162FF?style=for-the-badge)](https://secured.finance)
[![Static Badge](https://img.shields.io/badge/Trading_Platform-white?style=for-the-badge)](https://app.secured.finance)
[![Static Badge](https://img.shields.io/badge/Docs-11CABE?style=for-the-badge)](https://docs.secured.finance/)

</div>

## ⚡️ Quick Start

1. Clone this repository
2. Login on the GitHub npm package repository with `npm login --registry=https://npm.pkg.github.com`
3. Create a file `.env.local` at the root of the project. Please refer to `.env.local.sample` for the list of environment variables
4. Set your personal access token issued on your Github account by calling the following command: `export NPM_AUTH_TOKEN=<your access token>`
5. Install all required dependencies by running `npm install`
6. Run `npm run start` to start development mode

## 👍 Recommended Development Environment
This repository provides a `.vscode/settings.json` which assumes you have the following extensions installed in your code editor:
- ESLint
- Prettier
- TailwindCSS Intellisense
- Code Spell Checker

Those extensions helps streamline the development process by creating a standard way of formatting the code.

## 👨‍💻 Test the app
The web application is tested in multiple ways:

### Unit test
- Run `npm run test`

### Running the End to End tests locally with the interactive runner
You can find more information about the test runner [here](https://docs.cypress.io/guides/core-concepts/test-runner#Clicking-on-Commands)
- Create a file `cypress.env.json` at the root of the project. Please refer to `cypress.env.json.sample` for the list of environment variables needed
- Start the development server with `npm run start`
- Start the cypress interactive runner with `npm run cypress:open`
- Click on the spec to run it or all the specs

### Running the End to End test locally with the headless runner
This headless runner is a command line runner used for our continuous integration.
- Create a file `cypress.env.json` at the root of the project. Please refer to `cypress.env.json.sample` for the list of environment variables needed
- Start the development server with `npm run start`
- Start the cypress headless runner with `npm run cypress:run`

## 💻 Built with

Here's a brief high-level overview of the tech stack the Secured Finance App uses:

- [Next.js](https://nextjs.org/): A React framework that enables server-side rendering and simplifies the creation of performant web applications
- [Jest](https://jestjs.io/): Delightful JavaScript testing framework with a focus on simplicity and effectiveness, commonly used for unit and integration testing in React applications
- [Storybook](https://storybook.js.org/): Development environment for UI components, providing a sandboxed environment to visually develop and test components in isolation.
- [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework that allows for rapid UI development by providing pre-defined utility classes for styling elements
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview): Powerful library for managing server-state and caching in React applications, providing a straightforward way to fetch, cache, and update asynchronous data in components
- [Redux](https://redux.js.org/): Predictable state container for JavaScript applications, commonly used with React to manage application state in a centralized manner
- [Wagmi](https://wagmi.sh/): A useful library of React Hooks for Ethereum

## 🔖️ License

This project is licensed under the MIT license, Copyright (c) 2020 Secured Finance. For more information see `LICENSE.md`.
