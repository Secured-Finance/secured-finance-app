import CurrencyControllerABI from './CurrencyController.json';
import GenesisValueVaultABI from './GenesisValueVault.json';
import LendingMarketControllerABI from './LendingMarketController.json';
import LendingMarketReaderABI from './LendingMarketReader.json';
import TokenFaucetABI from './TokenFaucet.json';
import TokenVaultABI from './TokenVault.json';

// Type-safe ABI exports for wagmi
export const currencyControllerABI = CurrencyControllerABI;
export const genesisValueVaultABI = GenesisValueVaultABI;
export const lendingMarketControllerABI = LendingMarketControllerABI;
export const lendingMarketReaderABI = LendingMarketReaderABI;
export const tokenFaucetABI = TokenFaucetABI;
export const tokenVaultABI = TokenVaultABI;

// Named exports for easy imports
export {
    CurrencyControllerABI,
    GenesisValueVaultABI,
    LendingMarketControllerABI,
    LendingMarketReaderABI,
    TokenFaucetABI,
    TokenVaultABI,
};

// Contract names for wagmi config
export const CONTRACT_NAMES = {
    CURRENCY_CONTROLLER: 'CurrencyController',
    GENESIS_VALUE_VAULT: 'GenesisValueVault',
    LENDING_MARKET_CONTROLLER: 'LendingMarketController',
    LENDING_MARKET_READER: 'LendingMarketReader',
    TOKEN_FAUCET: 'TokenFaucet',
    TOKEN_VAULT: 'TokenVault',
} as const;

// All ABIs for bulk operations
export const ALL_ABIS = {
    [CONTRACT_NAMES.CURRENCY_CONTROLLER]: currencyControllerABI,
    [CONTRACT_NAMES.GENESIS_VALUE_VAULT]: genesisValueVaultABI,
    [CONTRACT_NAMES.LENDING_MARKET_CONTROLLER]: lendingMarketControllerABI,
    [CONTRACT_NAMES.LENDING_MARKET_READER]: lendingMarketReaderABI,
    [CONTRACT_NAMES.TOKEN_FAUCET]: tokenFaucetABI,
    [CONTRACT_NAMES.TOKEN_VAULT]: tokenVaultABI,
};
