import { WalletsStore } from './types';
export type { WalletsStore, WalletBase } from './types';

export { default } from './reducer';
export * from './actions';

export const walletsSelector = (state: { wallets: WalletsStore }) =>
    state.wallets;
