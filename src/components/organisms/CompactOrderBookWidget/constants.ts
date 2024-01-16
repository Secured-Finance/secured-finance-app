import { Option } from 'src/components/atoms';

export const AGGREGATION_OPTIONS: (Option<string> & { multiplier: number })[] =
    [
        { label: '0.01', value: '1', multiplier: 1 },
        { label: '0.1', value: '10', multiplier: 10 },
        { label: '1', value: '100', multiplier: 100 },
        { label: '5', value: '500', multiplier: 500 },
        { label: '10', value: '1000', multiplier: 1000 },
    ];
export const ORDERBOOK_DOUBLE_MAX_LINES = 6;
export const ORDERBOOK_SINGLE_MAX_LINES = 26;
