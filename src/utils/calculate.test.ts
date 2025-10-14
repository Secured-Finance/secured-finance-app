import {
    calculate,
    calculateBigInt,
    convert,
    convertBigInt,
} from './unifiedFormatter';
import { LoanValue, Maturity } from './entities';

describe('calculate utilities', () => {
    describe('calculate', () => {
        it('should floor a number', () => {
            expect(calculate.floor(1.9)).toBe(1);
            expect(calculate.floor(1.1)).toBe(1);
            expect(calculate.floor(-1.9)).toBe(-2);
        });

        it('should ceiling a number', () => {
            expect(calculate.ceiling(1.1)).toBe(2);
            expect(calculate.ceiling(1.9)).toBe(2);
            expect(calculate.ceiling(-1.1)).toBe(-1);
        });

        it('should ceil a number (alias)', () => {
            expect(calculate.ceil(1.1)).toBe(2);
            expect(calculate.ceil(1.9)).toBe(2);
        });

        it('should round a number', () => {
            expect(calculate.round(1.4)).toBe(1);
            expect(calculate.round(1.5)).toBe(2);
            expect(calculate.round(1.6)).toBe(2);
        });

        it('should get absolute value', () => {
            expect(calculate.abs(-5)).toBe(5);
            expect(calculate.abs(5)).toBe(5);
            expect(calculate.abs(0)).toBe(0);
        });

        it('should calculate price spread', () => {
            expect(calculate.priceSpread(100, 95)).toBe(5);
            expect(calculate.priceSpread(95, 100)).toBe(5);
        });

        it('should calculate APR spread', () => {
            expect(calculate.aprSpread(5.5, 3.2)).toBeCloseTo(2.3, 10);
            expect(calculate.aprSpread(3.2, 5.5)).toBeCloseTo(2.3, 10);
        });

        it('should return current timestamp in seconds', () => {
            const now = Date.now() / 1000;
            const timestamp = calculate.currentTimestamp();
            expect(timestamp).toBeGreaterThanOrEqual(Math.floor(now));
            expect(timestamp).toBeLessThanOrEqual(Math.ceil(now));
        });

        it('should calculate LoanValue from price', () => {
            const price = 9626;
            const maturity = 1669852800; // DEC 2022
            const calculationDate = 1638316800; // DEC 2021

            const result = calculate.loanValueFromPrice(
                price,
                maturity,
                calculationDate
            );

            expect(result).toBeInstanceOf(LoanValue);
            expect(result.price).toBe(price);
        });
    });

    describe('calculateBigInt', () => {
        it('should get absolute value of bigint', () => {
            expect(calculateBigInt.abs(-5n)).toBe(5n);
            expect(calculateBigInt.abs(5n)).toBe(5n);
            expect(calculateBigInt.abs(0n)).toBe(0n);
        });

        it('should return max of two bigints', () => {
            expect(calculateBigInt.max(100n, 50n)).toBe(100n);
            expect(calculateBigInt.max(50n, 100n)).toBe(100n);
            expect(calculateBigInt.max(50n, 50n)).toBe(50n);
        });

        it('should return min of two bigints', () => {
            expect(calculateBigInt.min(100n, 50n)).toBe(50n);
            expect(calculateBigInt.min(50n, 100n)).toBe(50n);
            expect(calculateBigInt.min(50n, 50n)).toBe(50n);
        });

        it('should calculate price spread for bigints', () => {
            expect(calculateBigInt.priceSpread(100n, 95n)).toBe(5n);
            expect(calculateBigInt.priceSpread(95n, 100n)).toBe(5n);
        });

        it('should calculate APR spread for bigints', () => {
            expect(calculateBigInt.aprSpread(550n, 320n)).toBe(230n);
            expect(calculateBigInt.aprSpread(320n, 550n)).toBe(230n);
        });

        it('should return current timestamp as bigint', () => {
            const now = BigInt(Math.floor(Date.now() / 1000));
            const timestamp = calculateBigInt.currentTimestamp();
            expect(timestamp).toBeGreaterThanOrEqual(now);
        });
    });

    describe('convert', () => {
        it('should convert from base to USD', () => {
            expect(convert.fromBaseToUSD(1000000, 6)).toBe(1);
            expect(convert.fromBaseToUSD(123456789, 6)).toBeCloseTo(
                123.456789,
                6
            );
        });

        it('should convert from USD to base', () => {
            expect(convert.fromUSDToBase(1, 6)).toBe(1000000);
            expect(convert.fromUSDToBase(123.456789, 6)).toBeCloseTo(
                123456789,
                0
            );
        });

        it('should convert Maturity to number', () => {
            const maturity = new Maturity(1669852800);
            expect(convert.maturity(maturity)).toBe(1669852800);
            expect(convert.maturity(1669852800)).toBe(1669852800);
            expect(convert.maturity(BigInt(1669852800))).toBe(1669852800);
        });
    });

    describe('convertBigInt', () => {
        it('should convert from base to USD', () => {
            expect(convertBigInt.fromBaseToUSD(1000000n, 6)).toBe(1n);
            expect(convertBigInt.fromBaseToUSD(123456789n, 6)).toBe(123n);
        });

        it('should convert from USD to base', () => {
            expect(convertBigInt.fromUSDToBase(1n, 6)).toBe(1000000n);
            expect(convertBigInt.fromUSDToBase(123n, 6)).toBe(123000000n);
        });

        it('should convert various types to bigint', () => {
            expect(convertBigInt.toBigInt(123)).toBe(123n);
            expect(convertBigInt.toBigInt(123n)).toBe(123n);
            expect(convertBigInt.toBigInt('123')).toBe(123n);
            expect(convertBigInt.toBigInt(123.9)).toBe(123n);
        });

        it('should convert Maturity to bigint', () => {
            const maturity = new Maturity(1669852800);
            expect(convertBigInt.toBigInt(maturity)).toBe(1669852800n);
        });

        it('should convert bigint to number', () => {
            expect(convertBigInt.toNumber(123n)).toBe(123);
            expect(convertBigInt.toNumber(0n)).toBe(0);
        });

        it('should convert maturity to bigint', () => {
            const maturity = new Maturity(1669852800);
            expect(convertBigInt.maturity(maturity)).toBe(1669852800n);
            expect(convertBigInt.maturity(1669852800)).toBe(1669852800n);
            expect(convertBigInt.maturity(BigInt(1669852800))).toBe(
                1669852800n
            );
        });
    });
});
