import { jun23Fixture, mar23Fixture } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import timemachine from 'timemachine';
import { RateType, useLoanValues } from './useLoanValues';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

const maturity = [mar23Fixture];

beforeAll(() => {
    timemachine.reset();
    timemachine.config({
        dateString: '2021-12-01T00:00:00.00Z',
    });
});

describe('useLoanValues', () => {
    it('should return an array of LoanValues for borrow rates', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useLoanValues(CurrencySymbol.ETH, RateType.Borrow, maturity)
        );
        expect(result.current).toEqual([]);

        await waitForNextUpdate();
        expect(result.current).toHaveLength(1);
        result.current.forEach((rate: unknown) =>
            expect(rate).toBeInstanceOf(LoanValue)
        );
    });

    it('should return an array of LoanValue for lend rates', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useLoanValues(CurrencySymbol.ETH, RateType.Lend, maturity)
        );
        expect(result.current).toEqual([]);

        await waitForNextUpdate();
        expect(result.current).toHaveLength(1);
        result.current.forEach((rate: unknown) =>
            expect(rate).toBeInstanceOf(LoanValue)
        );
    });

    it('should return an array of LoanValue for mid rates', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useLoanValues(CurrencySymbol.ETH, RateType.MidRate, [
                ...maturity,
                jun23Fixture,
            ])
        );
        expect(result.current).toEqual([]);

        await waitForNextUpdate();
        expect(result.current).toHaveLength(2);
        result.current.forEach((rate: unknown) =>
            expect(rate).toBeInstanceOf(LoanValue)
        );
    });
});
