export const MAX_COVERAGE = 10000;
export const ZERO_BI = BigInt(0);

export const computeAvailableToBorrow = (
    assetPrice: number,
    totalCollateralInUsd: number,
    coverageRatio: number, // [0,1]
    collateralThreshold: number
) => {
    const threshold = collateralThreshold / 100.0;
    if (assetPrice === 0 || threshold < coverageRatio) return 0;
    return ((threshold - coverageRatio) * totalCollateralInUsd) / assetPrice;
};

export const calculatePercentage = (value: bigint, total: bigint) => {
    return total === ZERO_BI ? ZERO_BI : (value * BigInt(100)) / total;
};
