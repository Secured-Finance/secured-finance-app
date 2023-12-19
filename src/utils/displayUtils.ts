import { getEnvShort } from './strings';

export const isProdEnv = (): boolean => {
    const envShort = getEnvShort();
    return envShort === 'prod';
};

export const isChipVisibleForEnv = () => {
    return getEnvShort() && !isProdEnv();
};
