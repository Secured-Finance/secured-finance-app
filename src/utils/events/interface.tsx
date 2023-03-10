export enum InterfaceEvents {
    CONNECT_WALLET_BUTTON_CLICKED = 'Connect Wallet Button Clicked',
    WALLET_CHANGED_THROUGH_PROVIDER = 'Wallet Changed Through Provider',
    WALLET_CONNECTED = 'Wallet Connected',
}

export enum InterfaceProperties {
    WALLET_CONNECTION_RESULT = 'Wallet Connection Result',
    WALLET_ADDRESS = 'Wallet Address',
}

export enum WalletConnectionResult {
    FAILED = 'Failed',
    SUCCEEDED = 'Succeeded',
}
