import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol, amountFormatterFromBase } from 'src/utils';
import { CollateralBook, useCollateralBook } from './';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

afterEach(() => mock.tokenVault.getCollateralBook.mockClear());

describe('useCollateralBook hook', () => {
    const FIL_PRICE = 6.0;

    it('should return the collateral book for an user', async () => {
        const { result } = renderHook(() => useCollateralBook('0x0'));

        const value = result.current;
        expect(value.data).toEqual(undefined);
        expect(value.isPending).toEqual(true);

        await waitFor(() =>
            expect(mock.tokenVault.getCollateralBook).toHaveBeenCalledTimes(1)
        );
        expect(mock.tokenVault.getCollateralParameters).toHaveBeenCalledTimes(
            1
        );
        expect(mock.tokenVault.getWithdrawableCollateral).toHaveBeenCalledTimes(
            3
        );

        const newValue = result.current;
        const colBook = newValue.data as CollateralBook;
        expect(colBook.collateral.ETH).toEqual(BigInt('1000000000000000000'));
        expect(colBook.collateral.USDC).toEqual(BigInt('100000000'));
        expect(colBook.collateral.WBTC).toEqual(BigInt('20000000'));
        expect(colBook.nonCollateral.WFIL).toEqual(
            BigInt('100000000000000000000')
        );
        expect(colBook.coverage).toEqual(3700);
        expect(colBook.collateralThreshold).toEqual(80);
        expect(colBook.withdrawableCollateral).toEqual({
            [CurrencySymbol.USDC]: BigInt('1000000000000'),
            [CurrencySymbol.ETH]: BigInt('1000000000000'),
            [CurrencySymbol.WBTC]: BigInt('1000000000000'),
        });
        expect(colBook.usdCollateral).toEqual(12100.34);
        expect(colBook.usdAvailableToBorrow).toBeCloseTo(5203.1462);
        expect(colBook.totalPresentValue).toEqual(2500);
        expect(newValue.isPending).toEqual(false);
    });

    it('should return undefined when given an undefined user', async () => {
        const { result } = renderHook(() => useCollateralBook(undefined));
        const colBook = result.current.data as CollateralBook;
        expect(colBook).toEqual(undefined);
    });

    it('should compute the non collaterals in USD', async () => {
        const { result } = renderHook(() => useCollateralBook('0x0'));

        await waitFor(() =>
            expect(mock.tokenVault.getCollateralBook).toHaveBeenCalledTimes(1)
        );
        const colBook = result.current.data as CollateralBook;
        expect(colBook.usdNonCollateral).toEqual(
            amountFormatterFromBase[CurrencySymbol.WFIL](
                colBook.nonCollateral.WFIL ?? BigInt(0)
            ) * FIL_PRICE
        );
    });
});
