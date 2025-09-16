import { AddressConverter, DisplayLengths } from './address';

const VALID_ADDRESS = '0x1234567890123456789012345678901234567890';
const ANOTHER_VALID_ADDRESS = '0x1234567890123456789012345678901234567891';

describe('AddressConverter.format', () => {
    it('should format address with default length', () => {
        expect(AddressConverter.format(VALID_ADDRESS)).toEqual('0x1234...7890');
    });

    it('should format address with custom length', () => {
        expect(AddressConverter.format(VALID_ADDRESS, 10)).toEqual(
            '0x12345678...7890'
        );
    });

    it('should return ... for empty or undefined address', () => {
        expect(AddressConverter.format('')).toEqual('...');
        expect(AddressConverter.format(undefined)).toEqual('...');
    });

    it('should return full address if shorter than truncation', () => {
        expect(AddressConverter.format('0x123', DisplayLengths.MEDIUM)).toEqual(
            '0x123'
        );
    });
});

describe('AddressConverter.equals', () => {
    it('should return true for identical addresses', () => {
        expect(
            AddressConverter.equals(VALID_ADDRESS, VALID_ADDRESS)
        ).toBeTruthy();
    });

    it('should return false for different addresses', () => {
        expect(
            AddressConverter.equals(VALID_ADDRESS, ANOTHER_VALID_ADDRESS)
        ).toBeFalsy();
    });

    it('should ignore case differences', () => {
        expect(
            AddressConverter.equals(
                '0x1234567890123456789012345678901234567890',
                '0X1234567890123456789012345678901234567890'
            )
        ).toBeTruthy();
    });
});

describe('AddressConverter.isValidFormat', () => {
    it('should return true for valid Ethereum addresses', () => {
        expect(AddressConverter.isValidFormat(VALID_ADDRESS)).toBeTruthy();
        expect(
            AddressConverter.isValidFormat(
                '0xABCDEF1234567890123456789012345678901234'
            )
        ).toBeTruthy();
    });

    it('should return false for invalid addresses', () => {
        expect(AddressConverter.isValidFormat('')).toBeFalsy();
        expect(AddressConverter.isValidFormat('0x123')).toBeFalsy();
        expect(
            AddressConverter.isValidFormat(
                '1234567890123456789012345678901234567890'
            )
        ).toBeFalsy();
        expect(
            AddressConverter.isValidFormat(
                '0xGHIJ567890123456789012345678901234567890'
            )
        ).toBeFalsy();
    });
});
