import { AddressConverter, AddressUtils } from './address';

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

    it('should return ... for empty address', () => {
        expect(AddressConverter.format('')).toEqual('...');
        expect(AddressConverter.format(null)).toEqual('...');
        expect(AddressConverter.format(undefined)).toEqual('...');
    });

    it('should return full address if shorter than truncation', () => {
        expect(AddressConverter.format('0x123', 6)).toEqual('0x123');
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
        expect(AddressConverter.isValidFormat(null)).toBeFalsy();
        expect(AddressConverter.isValidFormat(undefined)).toBeFalsy();
    });
});

describe('AddressConverter.toChecksum', () => {
    it('should convert valid address to checksum format', () => {
        const result = AddressConverter.toChecksum(VALID_ADDRESS);
        expect(result).toMatch(/^0x[a-fA-F0-9]{40}$/);
        expect(result).toEqual(
            '0x1234567890123456789012345678901234567890'.replace(
                /./g,
                (char, i) =>
                    i === 0 || i === 1
                        ? char
                        : i % 2 === 0
                        ? char.toUpperCase()
                        : char.toLowerCase()
            )
        );
    });

    it('should return original string for invalid addresses', () => {
        expect(AddressConverter.toChecksum('invalid')).toEqual('invalid');
        expect(AddressConverter.toChecksum('')).toEqual('');
    });
});

describe('AddressConverter.isENS', () => {
    it('should return true for ENS names', () => {
        expect(AddressConverter.isENS('vitalik.eth')).toBeTruthy();
        expect(AddressConverter.isENS('test.eth')).toBeTruthy();
    });

    it('should return false for non-ENS addresses', () => {
        expect(AddressConverter.isENS(VALID_ADDRESS)).toBeFalsy();
        expect(AddressConverter.isENS('test.com')).toBeFalsy();
        expect(AddressConverter.isENS('')).toBeFalsy();
        expect(AddressConverter.isENS(null)).toBeFalsy();
        expect(AddressConverter.isENS(undefined)).toBeFalsy();
    });
});

describe('AddressConverter.formatByContext', () => {
    it('should format by short context', () => {
        expect(
            AddressConverter.formatByContext(VALID_ADDRESS, 'short')
        ).toEqual('0x12...7890');
    });

    it('should format by medium context (default)', () => {
        expect(AddressConverter.formatByContext(VALID_ADDRESS)).toEqual(
            '0x1234...7890'
        );
        expect(
            AddressConverter.formatByContext(VALID_ADDRESS, 'medium')
        ).toEqual('0x1234...7890');
    });

    it('should format by long context', () => {
        expect(AddressConverter.formatByContext(VALID_ADDRESS, 'long')).toEqual(
            '0x12345678...7890'
        );
    });
});

// Backward compatibility tests
describe('AddressUtils (backward compatibility)', () => {
    it('should maintain format functionality', () => {
        expect(AddressUtils.format(VALID_ADDRESS, 10)).toEqual(
            '0x12345678...7890'
        );
        expect(AddressUtils.format()).toEqual('...');
    });

    it('should maintain equals functionality', () => {
        expect(AddressUtils.equals(VALID_ADDRESS, VALID_ADDRESS)).toBeTruthy();
        expect(
            AddressUtils.equals(VALID_ADDRESS, ANOTHER_VALID_ADDRESS)
        ).toBeFalsy();
        expect(
            AddressUtils.equals(
                '0x1234567890123456789012345678901234567890',
                '0X1234567890123456789012345678901234567890'
            )
        ).toBeTruthy();
    });
});
