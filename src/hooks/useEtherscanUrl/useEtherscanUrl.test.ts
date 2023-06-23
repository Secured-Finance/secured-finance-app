import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { useEtherscanUrl } from './useEtherscanUrl';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useEtherscanUrl', () => {
    it('should return sepolia etherscan link', async () => {
        const { result } = renderHook(() => useEtherscanUrl());
        const etherscanUrl = result.current;
        expect(etherscanUrl).toBe('https://sepolia.etherscan.io');
    });
});
