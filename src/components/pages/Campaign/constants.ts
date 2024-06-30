import { CurrencySymbol } from 'src/utils';

export const prodQuestChainId = 314;
export const devQuestChainId = 314159;
export const DEV_COLLATERAL_CURRENCIES = [
    CurrencySymbol.tFIL,
    CurrencySymbol.iFIL,
];
export const PROD_COLLATERAL_CURRENCIES = [
    CurrencySymbol.FIL,
    CurrencySymbol.iFIL,
];

export const stages = [
    {
        text: 'Core Fueling',
        active: false,
    },
    {
        text: 'Orbital Contracts',
        active: true,
    },
    {
        text: 'Stellar Minting',
        active: false,
    },
    {
        text: 'Galactic Pooling',
        active: false,
    },
    {
        text: 'Cosmic Tokenization',
        active: false,
    },
    {
        text: 'Universal Index Exploration',
        active: false,
    },
];
