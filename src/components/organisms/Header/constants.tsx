export const PRODUCTION_LINKS = [
    {
        text: 'Fixed Income',
        link: '/',
        alternateLinks: ['/global-itayose', '/itayose'],
        dataCy: 'trading',
    },
    {
        text: 'Stats',
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
        className: 'hidden desktop:flex',
    },
    {
        text: 'Points',
        link: '/points',
        dataCy: 'points',
        className: 'flex laptop:hidden desktop:flex',
    },
    {
        text: 'Campaign',
        link: '/campaign',
        dataCy: 'campaign',
        className: 'hidden desktop:flex',
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
