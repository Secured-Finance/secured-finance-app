import {
    Chain,
    TransactionReceipt,
    WaitForTransactionReceiptParameters,
    createPublicClient,
    createWalletClient,
    http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'wagmi';
import { MockConnector } from 'wagmi/connectors/mock';

const privateKey =
    '0xde926db3012af759b4f24b5a51ef6afa397f04670f634aa4f48d4480417007f3';

export const account = privateKeyToAccount(privateKey);

export const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
});

publicClient.waitForTransactionReceipt = async (
    args: WaitForTransactionReceiptParameters<Chain>,
) => {
    return {
        blockNumber: args.hash ? BigInt('123') : BigInt('0'),
    } as unknown as TransactionReceipt;
};

const walletClient = createWalletClient({
    account: account,
    chain: sepolia,
    transport: http(),
});

export const connector = new MockConnector({
    chains: [sepolia],
    options: {
        chainId: sepolia.id,
        walletClient: walletClient,
        flags: { isAuthorized: true },
    },
});
