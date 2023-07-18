export enum InterfaceEvents {
    CONNECT_WALLET_BUTTON_CLICKED = 'Connect Wallet Button Clicked',
    WALLET_CHANGED_THROUGH_PROVIDER = 'Wallet Changed Through Provider',
    WALLET_CONNECTED = 'Wallet Connected',
}

export enum OrderEvents {
    ORDER_PLACED = 'Order Placed',
}

export enum CollateralEvents {
    DEPOSIT_COLLATERAL = 'Deposit Collateral',
    WITHDRAW_COLLATERAL = 'Withdraw Collateral',
}

export enum OrderProperties {
    ORDER_SIDE = 'Order Side',
    ORDER_TYPE = 'Order Type',
    ASSET_TYPE = 'Asset Type',
    ORDER_MATURITY = 'Order Maturity',
    ORDER_AMOUNT = 'Order Amount',
    ORDER_PRICE = 'Order Price',
}

export enum CollateralProperties {
    ASSET_TYPE = 'Asset Type',
    AMOUNT = 'Amount',
    SOURCE = 'Source',
}

export enum InterfaceProperties {
    WALLET_CONNECTION_RESULT = 'Wallet Connection Result',
    WALLET_ADDRESS = 'Wallet Address',
    WALLET_CONNECTOR = 'Wallet Connector',
}

export enum WalletConnectionResult {
    FAILED = 'Failed',
    SUCCEEDED = 'Succeeded',
}
