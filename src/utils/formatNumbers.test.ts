import { BigNumber } from 'ethers';
import { formatWithCurrency, usdFormat } from './formatNumbers';

describe('formatWithCurrency', () => {
    it('should format the number with the given currency and decimals', () => {
        expect(formatWithCurrency(123456789, 'USD')).toEqual('123,456,789 USD');
        expect(formatWithCurrency(123456789, 'USD', 0)).toEqual(
            '123,456,789 USD'
        );
        expect(formatWithCurrency(123456789.123, 'EUR', 3)).toEqual(
            '123,456,789.123 EUR'
        );
        expect(formatWithCurrency(BigInt(123456789), 'JPY')).toEqual(
            '123,456,789 JPY'
        );
    });
});

describe('usdFormat', () => {
    it('formats a number as USD currency with the default parameters', () => {
        const number = 123456.789;
        const result = usdFormat(number);
        expect(result).toBe('$123,457');
    });

    it('formats a number as USD currency with specified number of fraction digits', () => {
        const number = 123456.789;
        const digits = 2;
        const result = usdFormat(number, digits);
        expect(result).toBe('$123,456.79');
    });

    it('formats a number as USD currency with specified notation', () => {
        const number = 123456.789;
        const notation = 'compact';
        const result = usdFormat(number, 0, notation);
        expect(result).toBe('$123K');
    });

    it('formats a BigNumber as USD currency with the default parameters', () => {
        const number = BigNumber.from('123456789123456789');
        const result = usdFormat(number);
        expect(result).toBe('$123,456,789,123,456,789');
    });

    it('formats a BigNumber as USD currency with specified number with a compact notation', () => {
        const number = BigNumber.from('123456789123');
        const digits = 0;
        const notation = 'compact';
        const result = usdFormat(number, digits, notation);
        expect(result).toBe('$123B');
    });
});
