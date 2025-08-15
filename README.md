<div align="center">

<img src="https://assets-global.website-files.com/64083b97a8837a1e7f5a3a33/64083b97a8837a05b25a3a57_logo.svg" width="328" />
<br/><br/>

![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/Secured-Finance/secured-finance-app) ![GitHub License](https://img.shields.io/github/license/Secured-Finance/secured-finance-app)

A DeFi Trading Platform utilizing Orderbook-based Rates, facilitating the lending and borrowing of digital assets for constructing yield curves within the DeFi ecosystem.

### Quick Links

[![Static Badge](https://img.shields.io/badge/Homepage-5162FF?style=for-the-badge)](https://secured.finance)
[![Static Badge](https://img.shields.io/badge/Trading_Platform-white?style=for-the-badge)](https://app.secured.finance)
[![Static Badge](https://img.shields.io/badge/Docs-11CABE?style=for-the-badge)](https://docs.secured.finance/)

</div>

## ⚡️ Quick Start

### Prerequisites

- Node.js 18.x (use `nvm use` to switch to the correct version)

### Setup Steps

1. Clone this repository
2. Set up environment variables:

   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and add your API keys (see Environment Variables section below)
   ```

3. Install dependencies:

   ```bash
   nvm use  # Switch to correct Node version
   npm install  # Install dependencies
   ```

4. Start development server:

   ```bash
   npm run start
   ```

### Environment Variables

The project uses two environment files:

- `.env` - Default values (committed to Git)
- `.env.local` - Your local secrets (gitignored)

Required variables in `.env.local`:

- `NEXT_PUBLIC_ALCHEMY_API_KEY` - Alchemy API key for blockchain interaction
- `NEXT_PUBLIC_AMPLITUDE_API_KEY` - Analytics tracking (optional for local dev)

## 👍 Recommended Development Environment

This repository provides a `.vscode/settings.json` which assumes you have the following extensions installed in your code editor:

- ESLint
- Prettier
- TailwindCSS Intellisense
- Code Spell Checker

Those extensions helps streamline the development process by creating a standard way of formatting the code.

## 🛠️ Development Workflow

### Code Formatting

The project uses Prettier for code formatting. To ensure consistency:

```bash
# Check formatting
npm run prettier:check

# Auto-fix formatting
npm run prettier:write
```

### Linting

```bash
# Check for linting issues
npm run lint:check

# Auto-fix linting issues
npm run lint:write
```

### Type Checking

```bash
npm run typecheck
```

### Running Tests

For most contributors, tests will automatically run in CI when you create a pull request.

If you need to run tests locally (core team members):

```bash
# Requires GitHub authentication for @secured-finance packages
# See internal documentation for setup

npm run test        # Watch mode for development
npm run test:cov    # With coverage (same as CI)
```

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
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro): Facilitates user-centric testing in React applications by providing intuitive utilities for querying and interacting with components
- [Storybook](https://storybook.js.org/): Development environment for UI components, providing a sandboxed environment to visually develop and test components in isolation.
- [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework that allows for rapid UI development by providing pre-defined utility classes for styling elements
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview): Powerful library for managing server-state and caching in React applications, providing a straightforward way to fetch, cache, and update asynchronous data in components
- [Redux](https://redux.js.org/): Predictable state container for JavaScript applications, commonly used with React to manage application state in a centralized manner
- [Wagmi](https://wagmi.sh/): A useful library of React Hooks for Ethereum

## 🔖️ License

This project is licensed under the MIT license, Copyright (c) 2024 Secured Finance. For more information see `LICENSE.md`.
