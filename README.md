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

1. Clone this repository
2. Login on the GitHub npm package repository with `npm login --registry=https://npm.pkg.github.com`
3. Create a file `.env.local` at the root of the project. Please refer to `.env.local.sample` for the list of environment variables
4. Run `nvm use` to ensure you are using the correct node version
5. Install all required dependencies by running `npm install`
6. Run `npm run start` to start development mode

## 👍 Recommended Development Environment
This repository provides a `.vscode/settings.json` which assumes you have the following extensions installed in your code editor:
- ESLint
- Prettier
- TailwindCSS Intellisense

## 🔧 Wagmi Code Generation

This project uses [wagmi CLI](https://wagmi.sh/cli/getting-started) to generate type-safe React hooks from smart contract ABIs.

### Quick Commands
```bash
# Generate wagmi hooks from contracts
npm run codegen:wagmi

# Verify generated files are up-to-date
npm run check:generated

# Run full local CI equivalent
npm run ci:local
```

### Generated Files
- **Location**: `src/generated/wagmi.ts`
- **Contains**: 359+ type-safe hooks for all contract interactions
- **Auto-generated**: Never edit manually, always regenerate

### Environment Support
```bash
# Development contracts (default)
npm run codegen:wagmi

# Staging contracts
SF_ENV=staging npm run codegen:wagmi

# Production contracts
SF_ENV=production npm run codegen:wagmi
```

## 🚩 Feature Flags

Gradual migration from legacy SDK to wagmi hooks is controlled by feature flags.

### Environment Variables
```bash
# Enable all wagmi hooks
NEXT_PUBLIC_USE_WAGMI_HOOKS=true

# Enable specific hooks only
NEXT_PUBLIC_WAGMI_HOOK_CURRENCIES=true
NEXT_PUBLIC_WAGMI_HOOK_BALANCES=true
```

### Testing Locally
```bash
# Test with legacy implementation (default)
npm run start

# Test with wagmi implementation
NEXT_PUBLIC_WAGMI_HOOK_CURRENCIES=true npm run start
```

## 🔄 Migration Status

| Hook | Status | Feature Flag |
|------|--------|--------------|
| useCurrencies | ✅ Migrated | `WAGMI_HOOK_CURRENCIES` |
| useBalances | 🔄 Ready | `WAGMI_HOOK_BALANCES` |
| useOrderbook | 🔄 Ready | `WAGMI_HOOK_ORDERBOOK` |
| useOrders | 📋 Planned | `WAGMI_HOOK_ORDERS` |
| usePositions | 📋 Planned | `WAGMI_HOOK_POSITIONS` |

### Development Workflow
1. **Pull latest**: `git pull origin develop`
2. **Install deps**: `npm install`
3. **Generate hooks**: `npm run codegen:wagmi`
4. **Run checks**: `npm run ci:local`
5. **Start dev**: `npm run start`

## 🐛 Troubleshooting

### Wagmi Generation Issues
```bash
# Issue: Cannot find module '@secured-finance/contracts'
npm install

# Issue: Generated files out of sync in CI
npm run codegen:wagmi
git add src/generated/wagmi.ts
git commit -m "chore: update generated wagmi hooks"

# Issue: TypeScript errors after generation
npm run typecheck  # Check for specific errors
```

### Feature Flag Issues
```bash
# Issue: Hook not using wagmi implementation
echo $NEXT_PUBLIC_WAGMI_HOOK_CURRENCIES  # Check flag is set
NEXT_PUBLIC_WAGMI_HOOK_CURRENCIES=true npm run start

# Issue: No development logging
# Check NODE_ENV=development and browser console
```

### Quick Fixes
```bash
# Reset everything
rm -rf node_modules .next
npm install
npm run codegen:wagmi
npm run start

# Verify setup
npm run ci:local  # Should pass all checks
```

📋 **For detailed troubleshooting, see [WAGMI-TEAM-GUIDE.md](./WAGMI-TEAM-GUIDE.md)**

## 👍 Recommended Development Environment
This repository provides a `.vscode/settings.json` which assumes you have the following extensions installed in your code editor:
- ESLint
- Prettier
- TailwindCSS Intellisense
- Code Spell Checker

Those extensions help streamline the development process by creating a standard way of formatting the code.

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
