export interface WalletState {
    address: string;
    balance: string;
}

export const DEFAULT_WALLET_STATE: WalletState = {
    address: '',
    balance: '0',
};

// Legacy export for backward compatibility - will be removed in future version
export type WalletStore = WalletState;
export const defaultWalletStore = DEFAULT_WALLET_STATE;
