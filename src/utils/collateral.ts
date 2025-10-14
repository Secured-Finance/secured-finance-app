import { FINANCIAL_CONSTANTS } from 'src/config/constants';

export const MAX_COVERAGE = FINANCIAL_CONSTANTS.BPS_DIVISOR;
import { divide, multiply } from './currencyList';

const PERCENTAGE_BASE = 100;
const LIQUIDATION_RATE_DIVISOR = 1_000_000;
const ZERO = 0;
const FUTURE_VALUE_MULTIPLIER = 10_000;
const DIVIDER_CONSTANT = 100_000_000n;
const DEFAULT_PRECISION = 8;

export const ZERO_BI = BigInt(0);
export const HUNDRED_BI = BigInt(100);

type InputValue = bigint | number | string;

export class CollateralCalculator {
    static toNumber(value: InputValue): number {
        return Number(value || ZERO);
    }

    static calculatePercentage(value: InputValue, total: InputValue): number {
        const vBig = BigInt(value || ZERO);
        const tBig = BigInt(total || ZERO);
        return tBig === ZERO_BI
            ? ZERO
            : multiply(
                  divide(vBig, tBig, DEFAULT_PRECISION),
                  PERCENTAGE_BASE,
                  DEFAULT_PRECISION
              );
    }

    static calculateRequiredCollateral(
        borrowAmount: InputValue,
        liquidationThreshold: InputValue
    ): number {
        const borrow = BigInt(borrowAmount || ZERO);
        const threshold = BigInt(liquidationThreshold || ZERO);
        return divide(
            multiply(borrow, threshold, DEFAULT_PRECISION),
            PERCENTAGE_BASE,
            DEFAULT_PRECISION
        );
    }

    static calculateRequiredCollateralFromFV(
        futureValue: InputValue,
        debtUnitPrice: InputValue
    ): bigint {
        const fv = BigInt(futureValue || ZERO);
        const debtPrice = BigInt(debtUnitPrice || ZERO);
        const result = divide(
            multiply(fv, debtPrice),
            FUTURE_VALUE_MULTIPLIER,
            0
        );
        return BigInt(Math.floor(result));
    }

    static calculateAvailableToBorrow(
        totalCollateral: InputValue,
        totalUnusedCollateral: InputValue,
        coverage: InputValue,
        liquidationThreshold: InputValue
    ): number {
        const total = this.toNumber(totalCollateral);
        const unused = this.toNumber(totalUnusedCollateral);
        const cov = this.toNumber(coverage);
        const threshold = this.toNumber(liquidationThreshold);

        const coverageAsPercentage = divide(
            cov,
            PERCENTAGE_BASE,
            DEFAULT_PRECISION
        );
        if (threshold <= coverageAsPercentage) return ZERO;

        const used = total - unused;
        const thresholdRatio = divide(
            threshold,
            PERCENTAGE_BASE,
            DEFAULT_PRECISION
        );
        const result =
            multiply(total, thresholdRatio, DEFAULT_PRECISION) - used;
        return Math.max(ZERO, result);
    }

    static calculateCollateralThreshold(
        liquidationThresholdRate: InputValue
    ): number {
        const rate = BigInt(liquidationThresholdRate || ZERO);
        return rate === ZERO_BI ? ZERO : divide(LIQUIDATION_RATE_DIVISOR, rate);
    }

    static calculateFutureValue(amount: InputValue, price: InputValue): bigint {
        const amountValue = BigInt(amount || ZERO);
        const priceValue = BigInt(price || ZERO);
        if (priceValue === ZERO_BI) return ZERO_BI;

        const result = divide(
            multiply(amountValue, FUTURE_VALUE_MULTIPLIER),
            priceValue,
            0
        );
        return BigInt(Math.floor(result));
    }

    static transformCollateralBookData(
        totalCollateralAmount: InputValue,
        totalUnusedCollateralAmount: InputValue,
        collateralCoverage: InputValue,
        totalPresentValue: InputValue,
        dividerAmount: bigint = DIVIDER_CONSTANT,
        precision: number = DEFAULT_PRECISION
    ): {
        usdCollateral: number;
        usdUnusedCollateral: number;
        coverage: number;
        totalPresentValue: number;
    } {
        const usdCollateral = divide(
            BigInt(totalCollateralAmount || ZERO),
            dividerAmount,
            precision
        );
        const usdUnusedCollateral = divide(
            BigInt(totalUnusedCollateralAmount || ZERO),
            dividerAmount,
            precision
        );
        const coverage = this.toNumber(collateralCoverage);
        const totalPV = divide(
            BigInt(totalPresentValue || ZERO),
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
