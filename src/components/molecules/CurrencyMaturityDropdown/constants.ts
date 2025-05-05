export const mobileColumns = [
    {
        key: 'symbol',
        label: 'Symbol',
        width: '20%',
    },
    {
        key: 'mark-prices-mobile',
        label: 'Mark Price (APR)',
        width: '20%',
        className: 'ml-2 text-wrap',
    },
    {
        key: 'change',
        label: '24h Price / APR Change',
        width: '20%',
        allowsSorting: true,
        className: 'text-wrap',
    },
    {
        key: 'maturity-mobile',
        label: 'Time to Maturity',
        width: '15%',
        allowsSorting: true,
        className: 'justify-end text-right text-wrap',
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
        key: 'apr',
        label: 'APR',
        width: '20%',
        allowsSorting: true,
    },
    {
        key: 'change',
        label: '24h Price / APR Change',
        width: '20%',
        allowsSorting: true,
        className: 'laptop:mr-5 mr-0',
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
