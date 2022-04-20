import { WalletsStore } from './types';
export * from './actions';
export { default } from './reducer';
export type { WalletBase, WalletsStore } from './types';

export const walletsSelector = (state: {
    wallets: WalletsStore;
}): WalletsStore => state.wallets;
