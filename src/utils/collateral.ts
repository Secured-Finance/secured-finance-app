import { divide, multiply } from './currencyList';

const PERCENTAGE_BASE = 100;
const LIQUIDATION_RATE_DIVISOR = 1000000;
const ZERO = 0;
const FUTURE_VALUE_MULTIPLIER = 10000;
const DIVIDER_CONSTANT = 100000000;
const DEFAULT_PRECISION = 8;

export const MAX_COVERAGE = 10000;
export const ZERO_BI = BigInt(0);

type InputValue = bigint | number | string;

export class CollateralCalculator {
    static toNumber(value: InputValue): number {
        return Number(value || ZERO);
    }

    static calculatePercentage(value: InputValue, total: InputValue): number {
        const v = this.toNumber(value);
        const t = this.toNumber(total);
        return t === ZERO ? ZERO : multiply(divide(v, t), PERCENTAGE_BASE);
    }

    static calculateRequiredCollateral(
        borrowAmount: InputValue,
        collateralThreshold: InputValue
    ): number {
        const borrow = this.toNumber(borrowAmount);
        const threshold = this.toNumber(collateralThreshold);
        return divide(multiply(borrow, threshold), PERCENTAGE_BASE);
    }

    static calculateAvailableToBorrow(
        totalCollateral: InputValue,
        totalUnusedCollateral: InputValue,
        coverage: InputValue,
        collateralThreshold: InputValue
    ): number {
        const total = this.toNumber(totalCollateral);
        const unused = this.toNumber(totalUnusedCollateral);
        const cov = this.toNumber(coverage);
        const threshold = this.toNumber(collateralThreshold);

        const coverageAsPercentage = divide(cov, PERCENTAGE_BASE);
        if (threshold <= coverageAsPercentage) return ZERO;

        const used = total - unused;
        const thresholdRatio = divide(threshold, PERCENTAGE_BASE);
        const result = multiply(total, thresholdRatio) - used;
        return Math.max(ZERO, result);
    }

    static calculateCollateralThreshold(
        liquidationThresholdRate: InputValue
    ): number {
        const rate = this.toNumber(liquidationThresholdRate);
        return rate === ZERO ? ZERO : divide(LIQUIDATION_RATE_DIVISOR, rate);
    }

    static calculateFutureValue(amount: InputValue, price: InputValue): number {
        const amountNum = this.toNumber(amount);
        const priceNum = this.toNumber(price);
        return priceNum === ZERO
            ? ZERO
            : divide(multiply(amountNum, FUTURE_VALUE_MULTIPLIER), priceNum);
    }

    static calculateBarWidth(
        value: InputValue,
        total: InputValue,
        maxWidth: number,
        minWidth: number
    ): number {
        const percentage = this.calculatePercentage(value, total);
        const ratio = divide(percentage, PERCENTAGE_BASE);
        const targetWidth = multiply(ratio, maxWidth);
        return Math.min(Math.max(targetWidth, minWidth), maxWidth);
    }

    static transformCollateralBookData(
        totalCollateralAmount: InputValue,
        totalUnusedCollateralAmount: InputValue,
        collateralCoverage: InputValue,
        totalPresentValue: InputValue,
        dividerAmount: number = DIVIDER_CONSTANT,
        precision: number = DEFAULT_PRECISION
    ): {
        usdCollateral: number;
        usdUnusedCollateral: number;
        coverage: number;
        totalPresentValue: number;
    } {
        // Use the same divide function as original code with exact same parameters
        const usdCollateral = divide(
            this.toNumber(totalCollateralAmount),
            dividerAmount,
            precision
        );
        const usdUnusedCollateral = divide(
            this.toNumber(totalUnusedCollateralAmount),
            dividerAmount,
            precision
        );
        const coverage = this.toNumber(collateralCoverage);
        const totalPV = divide(
            this.toNumber(totalPresentValue),
            dividerAmount,
            precision
        );

        return {
            usdCollateral,
            usdUnusedCollateral,
            coverage,
            totalPresentValue: totalPV,
        };
    }
}
