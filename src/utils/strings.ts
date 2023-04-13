import { formatDate } from '@secured-finance/sf-core';
import { Option } from 'src/components/atoms';
import { hexToNumber } from 'web3-utils';
import { Maturity } from './entities';
import { getEnvironment } from './env';

export enum Environment {
    DEVELOPMENT = 'development',
    STAGING = 'staging',
}

export const hexToDec = (key: string) => {
    if (key !== null) {
        return hexToNumber(key);
    }
};

export const formatDataCy = (str: string): string => {
    return str.replace(/\s+/g, '-').toLowerCase();
};

export function getTransformMaturityOption(options: Option<Maturity>[]) {
    return (label: string) => {
        const ts = options.find(o => o.label === label)?.value;
        if (!ts) {
            return label;
        }

        return formatDate(Number(ts.toNumber()));
    };
}

export const getEnvShort = () => {
    const env = getEnvironment();
    switch (env.toLowerCase()) {
        case Environment.DEVELOPMENT:
            return 'dev';
        case Environment.STAGING:
            return 'stg';
        default:
            return '';
    }
};
