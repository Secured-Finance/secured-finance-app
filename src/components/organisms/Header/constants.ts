export const PRODUCTION_LINKS = [
    {
        text: 'Trading',
        link: '/',
        alternateLinks: ['/global-itayose', '/itayose'],
        dataCy: 'trading',
    },
    {
        text: 'Markets',
        link: '/dashboard',
        dataCy: 'terminal',
    },
    {
        text: 'Portfolio',
        link: '/portfolio',
        dataCy: 'history',
    },
    {
        text: 'Bridge',
        link: '/bridge',
        dataCy: 'bridge',
    },
    {
        text: 'Points',
        link: '/points',
        dataCy: 'points',
    },
    {
        text: 'Campaign',
        link: '/campaign',
        dataCy: 'campaign',
    },
];

export const DEV_LINKS = [
    ...PRODUCTION_LINKS,
    {
        text: 'Faucet',
        link: '/faucet',
        dataCy: 'faucet',
    },
];

export const TRADING_LINKS = {
    text: 'Trading',
    dataCy: 'lending',
    alternateLinks: ['/', '/global-itayose', '/itayose'],
    links: [
        {
            text: 'Simple',
            link: '/simple',
        },
        {
            text: 'Advanced',
            link: '/',
        },
    ],
};
