import { maturities } from 'src/stories/mocks/fixtures';
import { renderHook } from 'src/test-utils';
import { useMaturityOptions } from './useMaturityOptions';

describe('useMaturityOptions', () => {
    it('should return an array of Maturity Option', async () => {
        const { result } = renderHook(() => useMaturityOptions(maturities));
        expect(result.current.length).toBe(9);

        expect(result.current[0].label).toBe('DEC22');
        expect(result.current[0].value.toNumber()).toBe(1669852800);
        expect(result.current[1].label).toBe('MAR23');
        expect(result.current[1].value.toNumber()).toBe(1677628800);
    });

    it('should return an array of Maturity Option with filter', async () => {
        const { result } = renderHook(() =>
            useMaturityOptions(maturities, market => market.isPreOrderPeriod)
        );
        expect(result.current.length).toBe(1);
        expect(result.current[0].label).toBe('DEC24');
        expect(result.current[0].value.toNumber()).toBe(1733011200);
    });

    it('should return an array with the empty option if no options are available', async () => {
        const { result } = renderHook(() =>
            useMaturityOptions(maturities, () => false)
        );
        expect(result.current.length).toBe(1);
        expect(result.current[0].label).toBe('');
        expect(result.current[0].value.toNumber()).toBe(0);
    });
});
