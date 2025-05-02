export const mobileColumns = [
    {
        key: 'symbol',
        label: 'Symbol',
        width: '40%',
    },
    {
        key: 'mark-prices-mobile',
        label: 'Mark Price (APR)',
        width: '27%',
    },
    {
        key: 'maturity-mobile',
        label: 'Time to Maturity',
        width: '27%',
        allowsSorting: true,
        className: 'justify-end text-right',
    },
];

export const desktopColumns = [
    {
        key: 'symbol',
        label: 'Symbol',
        width: '25%',
    },
    {
        key: 'mark-prices',
        label: 'Mark Price',
        width: '20%',
    },
    {
        key: 'change',
        label: '24H Change',
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
