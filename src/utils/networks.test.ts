import { mainnet, sepolia } from 'viem/chains';
import {
    getAnalogousChain,
    getSupportedNetworks,
    isTestnetChain,
} from './networks';

describe('networks', () => {
    it('should have three testnet supported networks', () => {
        const supportedNetworks = getSupportedNetworks();
        expect(supportedNetworks).toHaveLength(4);
        expect(supportedNetworks[0]).toEqual(sepolia);
    });

    it('should have four testnet and five mainnet supported networks', () => {
        process.env.SF_ENV = 'production';
        const supportedNetworks = getSupportedNetworks();
        expect(supportedNetworks).toHaveLength(9);
        expect(supportedNetworks[0]).toEqual(mainnet);
    });
});

describe('isTestnetChain', () => {
    describe('Testnet chains', () => {
        it('should return true for Sepolia', () => {
            expect(isTestnetChain(11155111)).toBe(true);
        });

        it('should return true for Filecoin Calibration', () => {
            expect(isTestnetChain(314159)).toBe(true);
        });

        it('should return true for Arbitrum Sepolia', () => {
            expect(isTestnetChain(421614)).toBe(true);
        });

        it('should return true for Avalanche Fuji', () => {
            expect(isTestnetChain(43113)).toBe(true);
        });
    });

    describe('Mainnet chains', () => {
        it('should return false for Ethereum mainnet', () => {
            expect(isTestnetChain(1)).toBe(false);
        });

        it('should return false for Filecoin mainnet', () => {
            expect(isTestnetChain(314)).toBe(false);
        });

        it('should return false for Arbitrum mainnet', () => {
            expect(isTestnetChain(42161)).toBe(false);
        });

        it('should return false for Avalanche mainnet', () => {
            expect(isTestnetChain(43114)).toBe(false);
        });

        it('should return false for Polygon zkEVM', () => {
            expect(isTestnetChain(1101)).toBe(false);
        });
    });

    describe('Unknown chains', () => {
        it('should return false for unknown chain ID', () => {
            expect(isTestnetChain(999999)).toBe(false);
        });

        it('should return false for zero chain ID', () => {
            expect(isTestnetChain(0)).toBe(false);
        });
    });
});

describe('getAnalogousChain', () => {
    const allSupportedChainIds = [
        1, 11155111, 314, 314159, 42161, 421614, 43114, 43113, 1101,
    ];

    describe('Mainnet to Testnet conversion', () => {
        it('should return Sepolia for Ethereum mainnet', () => {
            const result = getAnalogousChain(1, true, allSupportedChainIds);
            expect(result.id).toBe(11155111);
            expect(result.name).toBe('Sepolia');
        });

        it('should return Filecoin Calibration for Filecoin mainnet', () => {
            const result = getAnalogousChain(314, true, allSupportedChainIds);
            expect(result.id).toBe(314159);
            expect(result.name).toBe('Filecoin Calibration');
        });

        it('should return Arbitrum Sepolia for Arbitrum mainnet', () => {
            const result = getAnalogousChain(42161, true, allSupportedChainIds);
            expect(result.id).toBe(421614);
            expect(result.name).toBe('Arbitrum Sepolia');
        });

        it('should return Avalanche Fuji for Avalanche mainnet', () => {
            const result = getAnalogousChain(43114, true, allSupportedChainIds);
            expect(result.id).toBe(43113);
            expect(result.name).toBe('Avalanche Fuji');
        });

        it('should return Sepolia fallback for Polygon zkEVM (no testnet pair)', () => {
            const result = getAnalogousChain(1101, true, allSupportedChainIds);
            expect(result.id).toBe(11155111);
            expect(result.name).toBe('Sepolia');
        });
    });

    describe('Testnet to Mainnet conversion', () => {
        it('should return Ethereum for Sepolia', () => {
            const result = getAnalogousChain(
                11155111,
                false,
                allSupportedChainIds
            );
            expect(result.id).toBe(1);
            expect(result.name).toBe('Ethereum');
        });

        it('should return Filecoin for Filecoin Calibration', () => {
            const result = getAnalogousChain(
                314159,
                false,
                allSupportedChainIds
            );
            expect(result.id).toBe(314);
            expect(result.name).toBe('Filecoin Mainnet');
        });

        it('should return Arbitrum for Arbitrum Sepolia', () => {
            const result = getAnalogousChain(
                421614,
                false,
                allSupportedChainIds
            );
            expect(result.id).toBe(42161);
            expect(result.name).toBe('Arbitrum One');
        });

        it('should return Avalanche for Avalanche Fuji', () => {
            const result = getAnalogousChain(
                43113,
                false,
                allSupportedChainIds
            );
            expect(result.id).toBe(43114);
            expect(result.name).toBe('Avalanche');
        });
    });

    describe('Unknown chain handling', () => {
        it('should return Ethereum mainnet fallback for unknown chain requesting mainnet', () => {
            const result = getAnalogousChain(
                999999,
                false,
                allSupportedChainIds
            );
            expect(result.id).toBe(1);
            expect(result.name).toBe('Ethereum');
        });

        it('should return Sepolia testnet fallback for unknown chain requesting testnet', () => {
            const result = getAnalogousChain(
                999999,
                true,
                allSupportedChainIds
            );
            expect(result.id).toBe(11155111);
            expect(result.name).toBe('Sepolia');
        });
    });

    describe('Unsupported chain in environment', () => {
        it('should fall back to default testnet when paired testnet is not supported', () => {
            const limitedSupport = [1]; // Only Ethereum mainnet
            const result = getAnalogousChain(1, true, limitedSupport);
            expect(result.id).toBe(11155111);
            expect(result.name).toBe('Sepolia');
        });

        it('should fall back to default mainnet when paired mainnet is not supported', () => {
            const limitedSupport = [11155111]; // Only Sepolia testnet
            const result = getAnalogousChain(11155111, false, limitedSupport);
            expect(result.id).toBe(1);
            expect(result.name).toBe('Ethereum');
        });
    });

    describe('Edge cases', () => {
        it('should handle empty supported chains list', () => {
            const result = getAnalogousChain(1, true, []);
            expect(result.id).toBe(11155111);
            expect(result.name).toBe('Sepolia');
        });
    });
});
