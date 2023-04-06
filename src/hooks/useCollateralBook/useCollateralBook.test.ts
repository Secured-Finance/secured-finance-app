import { BigNumber } from 'ethers';
import {
    emptyCollateralBook,
    preloadedAssetPrices,
} from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { act, renderHook } from 'src/test-utils';
import { amountFormatterFromBase, CurrencySymbol } from 'src/utils';
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
        await act(async () => {
            await waitForNextUpdate();
        });
        const colBook = result.current as CollateralBook;
        expect(colBook.collateral.ETH).toEqual(
            BigNumber.from('1000000000000000000')
        );
        expect(colBook.collateral.USDC).toEqual(BigNumber.from('100000000'));
        expect(colBook.nonCollateral.WBTC).toEqual(BigNumber.from('20000000'));
        expect(colBook.nonCollateral.EFIL).toEqual(
            BigNumber.from('100000000000000000000')
        );
        expect(colBook.coverage.toString()).toEqual('8000');
    });

    it('should return the empty book when given an null user', async () => {
        const { result } = renderHook(() => useCollateralBook(null));
        const colBook = result.current as CollateralBook;
        expect(colBook).toEqual(emptyCollateralBook);
    });

    it('should compute the collaterals in USD', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => useCollateralBook('0x0'),
            { preloadedState }
        );
        await act(async () => {
            await waitForNextUpdate();
        });
        const colBook = result.current as CollateralBook;
        expect(colBook.usdCollateral).toEqual(
            amountFormatterFromBase[CurrencySymbol.ETH](
                colBook.collateral.ETH ?? BigNumber.from(0)
            ) *
                ETH_PRICE +
                amountFormatterFromBase[CurrencySymbol.USDC](
                    colBook.collateral.USDC ?? BigNumber.from(0)
                ) *
                    USDC_PRICE
        );
    });

    it('should compute the non collaterals in USD', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => useCollateralBook('0x0'),
            { preloadedState }
        );
        await act(async () => {
            await waitForNextUpdate();
        });
        const colBook = result.current as CollateralBook;
        expect(colBook.usdNonCollateral).toEqual(
            amountFormatterFromBase[CurrencySymbol.WBTC](
                colBook.nonCollateral.WBTC ?? BigNumber.from(0)
            ) *
                WBTC_PRICE +
                amountFormatterFromBase[CurrencySymbol.EFIL](
                    colBook.nonCollateral.EFIL ?? BigNumber.from(0)
                ) *
                    FIL_PRICE
        );
    });
});
