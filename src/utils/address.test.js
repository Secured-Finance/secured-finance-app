import { AddressUtils } from './address';

describe('AddressUtils.format', () => {
    it('should shorten the wallet address with a particular format', () => {
        expect(
            AddressUtils.format(
                '0x1234567890123456789012345678901234567890',
                10
            )
        ).toEqual('0x12345678...7890');
    });
});

describe('AddressUtils.equals', () => {
    it('should return true if two wallet addresses are equal', () => {
        expect(
            AddressUtils.equals(
                '0x1234567890123456789012345678901234567890',
                '0x1234567890123456789012345678901234567890'
            )
        ).toBeTruthy();
    });
    it('should return false if two wallet addresses are not equal', () => {
        expect(
            AddressUtils.equals(
                '0x1234567890123456789012345678901234567890',
                '0x1234567890123456789012345678901234567891'
            )
        ).toBeFalsy();
    });

    it('should ignore the case of the addresses', () => {
        expect(
            AddressUtils.equals(
                '0x1234567890123456789012345678901234567890',
                '0X1234567890123456789012345678901234567890'
            )
        ).toBeTruthy();
        expect(
            AddressUtils.equals(
                '0x1234567890123456789012345678901234567890',
                '0X1234567890123456789012345678901234567891'
            )
        ).toBeFalsy();
    });
});
