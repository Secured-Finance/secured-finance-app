// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const squidConfig: any = {
    integratorId: 'squid-swap-widget',
    companyName: 'Squid',
    style: {
        neutralContent: '#d3d0e7',
        baseContent: '#ffffff',
        base100: '#0f1419',
        base200: '#2a2e3d',
        base300: '#2a2e3d',
        error: '#ED6A5E',
        warning: '#FFB155',
        success: '#2EAEB0',
        primary: '#5562f6',
        secondary: '#F89CC3',
        secondaryContent: '#2a2e3d',
        neutral: '#002133',
        roundedBtn: '26px',
        roundedCornerBtn: '999px',
        roundedBox: '1rem',
        roundedDropDown: '20rem',
    },
    slippage: 1.5,
    infiniteApproval: false,
    enableExpress: true,
    apiUrl: 'https://api.squidrouter.com',
    comingSoonChainIds: [],
    titles: {
        swap: 'Swap',
        settings: 'Settings',
        wallets: 'Wallets',
        tokens: 'Select Token',
        chains: 'Select Chain',
        history: 'History',
        transaction: 'Transaction',
        allTokens: 'Select Token',
        destination: 'Destination address',
    },
    priceImpactWarnings: {
        warning: 3,
        critical: 5,
    },
    showOnRampLink: true,
    initialFromChainId: 314,
    initialToChainId: 1,
    defaultTokens: [
        {
            address: '0x6A7b717aE5Ed65F85BA25403D5063D368239828e',
            chainId: 1,
        },
    ],
};