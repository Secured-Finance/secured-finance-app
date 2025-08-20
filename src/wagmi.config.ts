import { defineConfig } from '@wagmi/cli';
import { react } from '@wagmi/cli/plugins';
import { getEnvironmentByChainId, type ContractEnvironments } from 'src/utils';
import {
    arbitrum,
    arbitrumSepolia,
    avalanche,
    avalancheFuji,
    filecoin,
    filecoinCalibration,
    mainnet,
    polygonZkEvm,
    sepolia,
} from 'viem/chains';

// Helper function to dynamically import contract deployment
function getContractDeployment(
    contractName: string,
    environment: ContractEnvironments
) {
    try {
        return require(`@secured-finance/contracts/deployments/${environment}/${contractName}.json`);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(
            `Contract ${contractName} not found in ${environment} environment`
        );
        return null;
    }
}

// All supported chains
const SUPPORTED_CHAINS = [
    mainnet,
    arbitrum,
    sepolia,
    arbitrumSepolia,
    avalanche,
    avalancheFuji,
    polygonZkEvm,
    filecoin,
    filecoinCalibration,
];

// Contract names to generate
const CONTRACT_NAMES = [
    'CurrencyController',
    'GenesisValueVault',
    'LendingMarketController',
    'LendingMarketReader',
    'TokenVault',
    'TokenFaucet',
] as const;

// Build environment-aware address mapping for each contract
function buildAddressMapping(contractName: string) {
    const addresses: Record<number, `0x${string}`> = {};

    for (const chain of SUPPORTED_CHAINS) {
        try {
            const environment = getEnvironmentByChainId(chain.id);
            const deployment = getContractDeployment(contractName, environment);

            if (deployment?.address) {
                addresses[chain.id] = deployment.address as `0x${string}`;
            }
        } catch (error) {
            // Skip chains where this contract or environment doesn't exist
            // eslint-disable-next-line no-console
            console.warn(
                `Skipping ${contractName} for chain ${chain.id}: ${error}`
            );
        }
    }

    return addresses;
}

// Get ABI for a contract (use first available deployment)
function getContractABI(contractName: string) {
    for (const chain of SUPPORTED_CHAINS) {
        try {
            const environment = getEnvironmentByChainId(chain.id);
            const deployment = getContractDeployment(contractName, environment);

            if (deployment?.abi) {
                return deployment.abi;
            }
        } catch (error) {
            continue;
        }
    }

    throw new Error(`No ABI found for contract ${contractName}`);
}

export default defineConfig({
    out: 'src/generated/wagmi.ts',
    contracts: CONTRACT_NAMES.map(contractName => ({
        name: contractName,
        abi: getContractABI(contractName),
        address: buildAddressMapping(contractName),
    })).filter(contract => Object.keys(contract.address).length > 0), // Only include contracts with valid addresses
    plugins: [
        react({
            // v1 hook names (compatible with wagmi@1.4.12)
            useContractRead: true,
            useContractWrite: true,
            usePrepareContractWrite: true,
            useContractEvent: true,
        }),
    ],
});
