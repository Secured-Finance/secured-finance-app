import { Currency } from '@secured-finance/sf-core';
import { BigNumber } from 'ethers';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useMarketTerminationRatio } from './useMarketTerminationRatio';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

beforeEach(() => mock.getMarketTerminationRatio.mockClear());

describe('useMarketTerminationRatio hook', () => {
    it('should return the ratio of collateral in the vault at the time of termination', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useMarketTerminationRatio()
        );

        expect(result.current.data).toEqual([]);
        await waitForNextUpdate();

        expect(mock.getMarketTerminationRatio).toHaveBeenCalledTimes(3); // 3 collateral tokens
        expect(result.current.data).toEqual([
            { currency: CurrencySymbol.ETH, ratio: 2000 },
            { currency: CurrencySymbol.WBTC, ratio: 4000 },
            { currency: CurrencySymbol.USDC, ratio: 4000 },
        ]);
    });

    it('should return the ratio of collateral even if the collateral is very big', async () => {
        mock.getMarketTerminationRatio.mockImplementation(
            (currency: Currency) => {
                switch (currency.symbol) {
                    case CurrencySymbol.ETH:
                        return Promise.resolve(
                            BigNumber.from('18000000000000')
                        );
                    case CurrencySymbol.USDC:
                        return Promise.resolve(
                            BigNumber.from('10000000000000')
                        );
                    case CurrencySymbol.WBTC:
                        return Promise.resolve(
                            BigNumber.from('25000000000000')
                        );
                    default:
                        throw new Error('Not implemented');
                }
            }
        );

        const { result, waitForNextUpdate } = renderHook(() =>
            useMarketTerminationRatio()
        );

        expect(result.current.data).toEqual([]);
        await waitForNextUpdate();

        expect(mock.getMarketTerminationRatio).toHaveBeenCalledTimes(3); // 3 collateral tokens
        expect(result.current.data).toEqual([
            { currency: CurrencySymbol.ETH, ratio: 3396 },
            { currency: CurrencySymbol.WBTC, ratio: 4717 },
            { currency: CurrencySymbol.USDC, ratio: 1887 },
        ]);
    });
});
