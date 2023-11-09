import { preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol, amountFormatterFromBase } from 'src/utils';
import { CollateralBook, useCollateralBook } from './';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useCollateralBook hook', () => {
    const ETH_PRICE = 2000.34;
    const USDC_PRICE = 1;
    const WBTC_PRICE = 50000.0;
    const FIL_PRICE = 6.0;
    const preloadedState = {
        ...preloadedAssetPrices,
    };

    it('should return the collateral book for an user', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useCollateralBook('0x0')
        );

        const value = result.current;
        expect(value.data).toEqual(undefined);
        expect(value.isLoading).toEqual(true);

        await waitForNextUpdate();
        expect(mock.getCollateralBook).toHaveBeenCalledTimes(1);
        expect(mock.getCollateralParameters).toHaveBeenCalledTimes(1);
        expect(mock.getWithdrawableCollateral).toHaveBeenCalledTimes(3);

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
        expect(newValue.isLoading).toEqual(false);
    });

    it('should return undefined when given an undefined user', async () => {
        const { result } = renderHook(() => useCollateralBook(undefined));
        const colBook = result.current.data as CollateralBook;
        expect(colBook).toEqual(undefined);
    });

    it('should compute the collaterals in USD', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => useCollateralBook('0x0'),
            { preloadedState }
        );
        await waitForNextUpdate();
        const colBook = result.current.data as CollateralBook;
        expect(colBook.usdCollateral).toEqual(
            amountFormatterFromBase[CurrencySymbol.ETH](
                colBook.collateral.ETH ?? BigInt(0)
            ) *
                ETH_PRICE +
                amountFormatterFromBase[CurrencySymbol.USDC](
                    colBook.collateral.USDC ?? BigInt(0)
                ) *
                    USDC_PRICE +
                amountFormatterFromBase[CurrencySymbol.WBTC](
                    colBook.collateral.WBTC ?? BigInt(0)
                ) *
                    WBTC_PRICE
        );
    });

    it('should compute the non collaterals in USD', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => useCollateralBook('0x0'),
            { preloadedState }
        );
        await waitForNextUpdate();
        const colBook = result.current.data as CollateralBook;
        expect(colBook.usdNonCollateral).toEqual(
            amountFormatterFromBase[CurrencySymbol.WBTC](
                colBook.nonCollateral.WBTC ?? BigInt(0)
            ) *
                WBTC_PRICE +
                amountFormatterFromBase[CurrencySymbol.WFIL](
                    colBook.nonCollateral.WFIL ?? BigInt(0)
                ) *
                    FIL_PRICE
        );
    });
});
