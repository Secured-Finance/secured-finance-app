import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { useBlockExplorerUrl } from './useBlockExplorerUrl';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useBlockExplorerUrl', () => {
    it('should return sepolia etherscan link', async () => {
        const { result } = renderHook(() => useBlockExplorerUrl());
        const { blockExplorerUrl } = result.current;
        expect(blockExplorerUrl).toBe('https://sepolia.etherscan.io');
    });

    it('should return sepolia arbiscan link when chain is Arbitrum sepolia', () => {
        mock.config.chain.id = 421614;
        const { result } = renderHook(() => useBlockExplorerUrl());
        const { blockExplorerUrl } = result.current;
        expect(blockExplorerUrl).toBe('https://sepolia.arbiscan.io');
    });

    it('should return testnet snowtrace link when chain is Avalanche Fuji', () => {
        mock.config.chain.id = 43113;
        const { result } = renderHook(() => useBlockExplorerUrl());
        const { blockExplorerUrl } = result.current;
        expect(blockExplorerUrl).toBe('https://testnet.snowtrace.io');
    });
});
