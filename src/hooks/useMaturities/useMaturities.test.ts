import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useMaturities } from './useMaturities';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useMaturities', () => {
    const maturities = [
        BigInt('1000'),
        BigInt('2000'),
        BigInt('3000'),
        BigInt('4000'),
        BigInt('5000'),
    ];
    const stringMaturities = maturities.map((v: bigint) => v.toString());

    beforeAll(() => {
        mock.getMaturities.mockResolvedValueOnce(maturities);
        mock.getLatestAutoRollLog.mockResolvedValueOnce({
            unitPrice: BigInt('9800'),
            lastAutoRollTime: BigInt('1609210000'),
            lastAutoRollAmount: BigInt('1000000000000000000'),
            next: BigInt('0'),
            prev: BigInt('900'),
        });
        mock.getAutoRollLog.mockResolvedValueOnce({
            unitPrice: BigInt('9800'),
            lastAutoRollTime: BigInt('1609210000'),
            lastAutoRollAmount: BigInt('1000000000000000000'),
            next: BigInt('1000'),
            prev: BigInt('800'),
        });
    });

    it('should return the maturity array not including past maturities', async () => {
        const { result } = renderHook(() =>
            useMaturities(CurrencySymbol.ETH, 0)
        );
        await waitFor(() => {
            expect(
                result.current.data.map((v: bigint) => v.toString())
            ).toEqual(stringMaturities);
        });
    });

    it('should return the maturity array not including one past maturity', async () => {
        const { result } = renderHook(() =>
            useMaturities(CurrencySymbol.ETH, 1)
        );
        await waitFor(() => {
            expect(
                result.current.data.map((v: bigint) => v.toString())
            ).toEqual(['900', ...stringMaturities]);
        });
    });

    it('should return the maturity array not including multiple past maturity', async () => {
        const { result } = renderHook(() =>
            useMaturities(CurrencySymbol.ETH, 2)
        );
        await waitFor(() => {
            expect(
                result.current.data.map((v: bigint) => v.toString())
            ).toEqual(['800', '900', ...stringMaturities]);
        });
    });
});
