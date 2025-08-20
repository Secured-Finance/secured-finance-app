import { Option } from 'src/components/atoms';
import { getEnvironment } from './env';
import { formatDate } from '@secured-finance/sf-core';
export enum Environment {
    DEVELOPMENT = 'development',
    STAGING = 'staging',
    PRODUCTION = 'production',
}

export const formatDataCy = (str: string): string => {
    return str.replace(/\s+/g, '-').toLowerCase();
};

export function getTransformMaturityOption(options: Option[]) {
    return (label: string) => {
        const ts = options.find(o => o.label === label)?.value;
        if (!ts) {
            return label;
        }
        const timestamp = Number(ts);
        if (isNaN(timestamp)) {
            return label;
        }
        return formatDate(timestamp);
    };
}

export const getEnvShort = (): 'dev' | 'stg' | 'prod' | '' => {
    const env = getEnvironment();
    switch (env.toLowerCase()) {
        case Environment.DEVELOPMENT:
            return 'dev';
        case Environment.STAGING:
            return 'stg';
        case Environment.PRODUCTION:
            return 'prod';
        default:
            return '';
    }
};

export const prefixTilde = (value: string): string => {
    return value ? `~ ${value}` : '';
};
