export const PRODUCTION_LINKS = [
    {
        text: 'Fixed Income',
        link: '/',
        alternateLinks: ['/global-itayose'],
        dataCy: 'trading',
    },
    {
        text: 'Stats',
        link: '/stats',
        dataCy: 'terminal',
    },
    {
        text: 'Portfolio',
        link: '/portfolio',
        dataCy: 'history',
    },
    {
        text: 'Swap',
        link: '/swap',
        dataCy: 'swap',
        className: 'hidden desktop:flex',
    },
    {
        text: 'Points',
        link: '/points',
        dataCy: 'points',
        className: 'flex laptop:hidden desktop:flex',
    },
];

export const DEV_LINKS = [
    ...PRODUCTION_LINKS,
    {
        text: 'Faucet',
        link: '/faucet',
        dataCy: 'faucet',
        className: 'flex laptop:hidden desktop:flex',
    },
];

export const TRADING_LINKS = {
    text: 'Trading',
    dataCy: 'lending',
    alternateLinks: ['/', '/global-itayose'],
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
