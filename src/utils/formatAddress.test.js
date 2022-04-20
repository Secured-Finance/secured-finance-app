import { formatAddress } from './formatAddress';

describe('FormatAddress', () => {
    it('should shorten the wallet address with a particular format', () => {
        expect(
            formatAddress('0x1234567890123456789012345678901234567890', 10)
        ).toEqual('0x12345678...7890');
    });
});
