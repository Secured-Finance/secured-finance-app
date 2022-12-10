import mockDate from 'mockdate';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol, Rate } from 'src/utils';
import { Maturity } from 'src/utils/entities';
import { RateType, useRates } from './useRates';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

const maturityMar23 = new Maturity(1675252800);

beforeAll(() => {
    mockDate.reset();
    mockDate.set('2022-12-01T11:00:00.00Z');
});

describe('useRates', () => {
    it('should return an array of number for borrow rates', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useRates(CurrencySymbol.ETH, RateType.Borrow, maturityMar23)
        );
        expect(result.current).toEqual([]);

        await waitForNextUpdate();
        result.current.forEach((rate: unknown) =>
            expect(rate).toBeInstanceOf(Rate)
        );
    });

    it('should return an array of number for lend rates', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useRates(CurrencySymbol.ETH, RateType.Lend, maturityMar23)
        );
        expect(result.current).toEqual([]);

        await waitForNextUpdate();
        result.current.forEach((rate: unknown) =>
            expect(rate).toBeInstanceOf(Rate)
        );
    });

    it('should return an array of number for mid rates', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useRates(CurrencySymbol.ETH, RateType.MidRate, maturityMar23)
        );
        expect(result.current).toEqual([]);

        await waitForNextUpdate();
        result.current.forEach((rate: unknown) =>
            expect(rate).toBeInstanceOf(Rate)
        );
    });
});
