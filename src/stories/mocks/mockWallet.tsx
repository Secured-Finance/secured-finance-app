import { http, type Chain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { mock } from 'wagmi/connectors';

const privateKey =
    '0xde926db3012af759b4f24b5a51ef6afa397f04670f634aa4f48d4480417007f3';

export const account = privateKeyToAccount(privateKey);

export const connector = mock({
    accounts: [account.address],
});

// Add switchChain for test mocking
// Type assertion needed because we're adding to factory for test purposes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(connector as any).switchChain = async ({
    chainId,
}: {
    chainId: number;
}): Promise<Chain> => {
    const chains = [sepolia];
    const chain = chains.find(c => c.id === chainId);
    if (!chain) throw new Error(`Chain ${chainId} not supported`);
    return chain;
};

export const config = createConfig({
    chains: [sepolia],
    transports: {
        [sepolia.id]: http(),
    },
    connectors: [connector],
});
