import { LoanValue } from './entities';
import { formatLoanValue } from './formatNumbers';
import { Rate } from './rate';

describe('formatNumbers', () => {
    describe('formatLoanValue', () => {
        it('should format the price correctly', () => {
            expect(
                formatLoanValue(LoanValue.fromPrice(9698, 100), 'price')
            ).toEqual('96.98');
            expect(
                formatLoanValue(LoanValue.fromPrice(9600, 100), 'price')
            ).toEqual('96.00');
        });

        it('should format the rate correctly', () => {
            expect(
                formatLoanValue(
                    LoanValue.fromApy(new Rate(515000), 100),
                    'rate'
                )
            ).toEqual('51.50%');
            expect(
                formatLoanValue(
                    LoanValue.fromApy(new Rate(500000), 100),
                    'rate'
                )
            ).toEqual('50.00%');
        });
    });
});
