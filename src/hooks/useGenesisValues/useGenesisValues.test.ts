import { ethBytes32 } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { Position } from '../usePositions';
import { useGenesisValues } from './useGenesisValues';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useGenesisValues', () => {
    const positions: Position[] = [
        {
            currency: ethBytes32,
            maturity: '0',
            amount: BigInt('1000000000000000000'),
            futureValue: BigInt('1250000000000000000'),
            marketPrice: BigInt('9800'),
        },
    ];
    it('should return the genesis values', async () => {
        mock.getGenesisValue.mockResolvedValueOnce([
            BigInt('1000000000000000000'),
            BigInt('2000000000000000000'),
            BigInt('3000000000000000000'),
        ]);

        const { result } = renderHook(() =>
            useGenesisValues('0x123', positions),
        );

        await waitFor(() => {
            expect(result.current.length).toEqual(1);
            expect(result.current[0].data.currency).toEqual(CurrencySymbol.ETH);
            expect(result.current[0].data.amount.toString()).toEqual(
                '1000000000000000000',
            );
            expect(result.current[0].data.amountInPV.toString()).toEqual(
                '2000000000000000000',
            );
            expect(result.current[0].data.amountInFV.toString()).toEqual(
                '3000000000000000000',
            );
        });
    });
});
