export const MAX_COVERAGE = 10000;
export const ZERO_BI = BigInt(0);

export const calculatePercentage = (value: bigint, total: bigint) => {
    return total === ZERO_BI ? ZERO_BI : (value * BigInt(100)) / total;
};
