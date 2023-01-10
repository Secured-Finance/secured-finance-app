import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';
import timemachine from 'timemachine';
import { RateType, useLoanValues } from './useLoanValues';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

const maturityMar23 = new Maturity(1675252800);

beforeAll(() => {
    timemachine.reset();
    timemachine.config({
        dateString: '2021-12-01T11:00:00.00Z',
    });
});

describe('useLoanValues', () => {
    it('should return an array of LoanValues for borrow rates', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useLoanValues(CurrencySymbol.ETH, RateType.Borrow, maturityMar23)
        );
        expect(result.current).toEqual([]);

        await waitForNextUpdate();
        result.current.forEach((rate: unknown) =>
            expect(rate).toBeInstanceOf(LoanValue)
        );
    });

    it('should return an array of LoanValue for lend rates', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useLoanValues(CurrencySymbol.ETH, RateType.Lend, maturityMar23)
        );
        expect(result.current).toEqual([]);

        await waitForNextUpdate();
        result.current.forEach((rate: unknown) =>
            expect(rate).toBeInstanceOf(LoanValue)
        );
    });

    it('should return an array of LoanValue for mid rates', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useLoanValues(CurrencySymbol.ETH, RateType.MidRate, maturityMar23)
        );
        expect(result.current).toEqual([]);

        await waitForNextUpdate();
        result.current.forEach((rate: unknown) =>
            expect(rate).toBeInstanceOf(LoanValue)
        );
    });
});
