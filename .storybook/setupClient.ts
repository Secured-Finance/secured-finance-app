import {
    PrivateKeyAccount,
    RpcRequestError,
    TransactionReceipt,
    WaitForTransactionReceiptParameters,
    createPublicClient,
    createWalletClient,
    custom,
    http,
} from 'viem';
import { Chain, foundry, mainnet, sepolia } from 'viem/chains';
import { rpc } from 'viem/utils';

export const foundryMainnet: Chain = {
    ...mainnet,
    rpcUrls: foundry.rpcUrls,
};

const testChains = [sepolia];

export function getPublicClient({
    chains = testChains,
}: { chains?: Chain[]; chainId?: number } = {}) {
    const chain = sepolia;
    const url = foundryMainnet.rpcUrls.default.http[0];
    const publicClient = createPublicClient({
        chain,
        transport: http(url),
        pollingInterval: 1000,
    });
    publicClient.waitForTransactionReceipt = async (
        args: WaitForTransactionReceiptParameters<Chain>
    ) => {
        return {
            blockNumber: args.hash ? '123' : '',
        } as unknown as TransactionReceipt;
    };

    return Object.assign(publicClient, {
        chains,
        toJSON() {
            return `<PublicClient network={${chain.id}} />`;
        },
    });
}

export function getWalletClient(account: PrivateKeyAccount) {
    const publicClient = getPublicClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    publicClient.request = async ({ method, params }: any) => {
        if (method === 'personal_sign') {
            method = 'eth_sign';
            params = [params[1], params[0]];
        }

        const url = foundryMainnet.rpcUrls.default.http[0];
        const body = {
            method,
            params,
        };
        const { result, error } = await rpc.http(url, {
            body,
        });
        if (error) {
            throw new RpcRequestError({
                body,
                error,
                url,
            });
        }
        return result;
    };

    return createWalletClient({
        account: account.address,
        chain: publicClient.chain,
        transport: custom(publicClient),
    });
}
