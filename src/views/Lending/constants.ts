import BigNumber from 'bignumber.js/bignumber';

export const daysInYear = [90, 180, 360, 720, 1080, 1800];
export const MIN_COVERAGE = 150;

export const calculatePercents = (
    a: BigNumber,
    b: BigNumber,
    toFixed = 0
): string => {
    if (a.isEqualTo(0) || b.isEqualTo(0)) return '0';
    return a.dividedBy(b).multipliedBy(100).toFixed(toFixed);
};
