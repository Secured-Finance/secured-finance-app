export const mobileColumns = [
    {
        key: 'symbol',
        label: 'Symbol',
        width: '50%',
    },
    {
        key: 'last-prices-mobile',
        label: 'Last Price (APR)',
        width: '50%',
    },
];

export const desktopColumns = [
    {
        key: 'symbol',
        label: 'Symbol',
        width: '25%',
    },
    {
        key: 'last-prices',
        label: 'Last Price (APR)',
        width: '20%',
    },
    {
        key: 'apr',
        label: 'APR',
        width: '20%',
        allowsSorting: true,
    },
    {
        key: 'volume',
        label: 'Volume',
        width: '20%',
        allowsSorting: true,
        isSubgraphSupported: true,
    },
    {
        key: 'maturity',
        label: 'Time to Maturity',
        width: '15%',
        allowsSorting: true,
        className: 'justify-end text-right',
    },
];
