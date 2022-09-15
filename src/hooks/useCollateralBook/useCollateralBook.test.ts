import BigNumber from 'bignumber.js';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { act, renderHook } from 'src/test-utils';
import { currencyMap } from 'src/utils';
import { CollateralBook, useCollateralBook } from './';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useCollateralBook hook', () => {
    const ETH = currencyMap.ETH;
    const ETH_PRICE = 2000;
    const preloadedState = {
        assetPrices: {
            ethereum: {
                price: ETH_PRICE,
                change: 0.5162466489453748,
            },
        },
    };
    it('should return the collateral book for an user', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useCollateralBook('0x0', ETH.symbol)
        );
        await act(async () => {
            await waitForNextUpdate();
        });
        const colBook = result.current as CollateralBook;
        expect(colBook.ccyIndex).toEqual(ETH.indexCcy);
        expect(colBook.ccyName).toEqual('ETH');
        expect(colBook.collateral.toString()).toEqual('10000');
    });

    it('should return the empty book when given an null user', async () => {
        const { result } = renderHook(() => useCollateralBook(null));
        const colBook = result.current as CollateralBook;
        expect(colBook.ccyIndex).toEqual(ETH.indexCcy);
        expect(colBook.ccyName).toEqual('ETH');
        expect(colBook.collateral).toEqual(new BigNumber('0'));
    });

    it('should compute the collaterals in USD', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => useCollateralBook('0x0', ETH.symbol),
            { preloadedState }
        );
        await act(async () => {
            await waitForNextUpdate();
        });
        const colBook = result.current as CollateralBook;
        expect(colBook.usdCollateral.toString()).toEqual(
            (colBook.collateral.toNumber() * ETH_PRICE).toString()
        );
    });
});
