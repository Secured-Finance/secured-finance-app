import { formatDate } from '@secured-finance/sf-core';
import { Option } from 'src/components/atoms';
import { getEnvironment } from './env';
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
        if (!ts || isNaN(Number(ts))) {
            return label;
        }

        return formatDate(Number(ts));
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

export const isProdEnv = (): boolean => {
    const envShort = getEnvShort();
    return envShort === 'prod';
};

export const prefixTilde = (value: string): string => {
    return value ? `~ ${value}` : '';
};
