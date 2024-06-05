import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { Environment } from 'src/utils';
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

    it('should return mainnet when chain is Ethereum mainnet', () => {
        process.env.SF_ENV = Environment.PRODUCTION;
        mock.config.chain.id = 1;
        const { result } = renderHook(() => useBlockExplorerUrl());
        const { blockExplorerUrl } = result.current;
        expect(blockExplorerUrl).toBe('https://etherscan.io');
    });

    it('should return arbiscan link when chain is Arbitrum One', () => {
        process.env.SF_ENV = Environment.PRODUCTION;
        mock.config.chain.id = 42161;
        const { result } = renderHook(() => useBlockExplorerUrl());
        const { blockExplorerUrl } = result.current;
        expect(blockExplorerUrl).toBe('https://arbiscan.io');
    });

    it('should return snowtrace link when chain is Avalanche', () => {
        process.env.SF_ENV = Environment.PRODUCTION;
        mock.config.chain.id = 43114;
        const { result } = renderHook(() => useBlockExplorerUrl());
        const { blockExplorerUrl } = result.current;
        expect(blockExplorerUrl).toBe('https://snowtrace.io');
    });

    it('should return polygonscan link when chain is Polygon ZkEvm', () => {
        process.env.SF_ENV = Environment.PRODUCTION;
        mock.config.chain.id = 1101;
        const { result } = renderHook(() => useBlockExplorerUrl());
        const { blockExplorerUrl } = result.current;
        expect(blockExplorerUrl).toBe('https://zkevm.polygonscan.com');
    });
});
