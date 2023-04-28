import { BigNumber } from 'ethers';
import { CurrencySymbol } from '../currencyList';
import { Amount } from './amount';

describe('Amount class', () => {
    const mockCurrency = CurrencySymbol.ETH;
    const mockValue = BigNumber.from('1000000000000000000'); // 1 ETH in wei
    const mockPrice = 2000;

    it('should create an instance of the Amount class', () => {
        const amount = new Amount(mockValue, mockCurrency);
        expect(amount).toBeInstanceOf(Amount);
    });

    it('should return the correct value and currency', () => {
        const amount = new Amount(mockValue, mockCurrency);
        expect(amount.value).toEqual(1);
        expect(amount.currency).toEqual(mockCurrency);
    });

    it('should convert to USD correctly', () => {
        const amount = new Amount(mockValue, mockCurrency);
        const usdValue = amount.toUSD(mockPrice);
        expect(usdValue).toEqual(2000);
    });

    it('should return the correct BigNumber value', () => {
        const amount = new Amount(mockValue, mockCurrency);
        const bigNumberValue = amount.toBigNumber();
        expect(bigNumberValue).toEqual(mockValue);
    });
});
