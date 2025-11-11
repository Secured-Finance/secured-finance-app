import { Token } from '@secured-finance/sf-core';
import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { Address, Abi } from 'viem';
import { CurrencySymbol } from './currencyList';

interface CustomFaucetConfig {
    tokenAddress: Address;
    faucetAddress: Address;
    functionName: string;
    abi: Abi;
    getArgs: (account: Address) => unknown[];
}

/**
 * Registry for tokens with custom faucet contracts.
 * Most tokens use the standard TokenFaucet contract via SDK.
 */
const CUSTOM_FAUCETS: Partial<Record<CurrencySymbol, CustomFaucetConfig>> = {
    [CurrencySymbol.JPYC]: {
        tokenAddress: '0xE7C3D8C9a439feDe00D2600032D5dB0Be71C3c29',
        faucetAddress: '0x8ca1d8dabaa60231af875599558beb0a5aedd52b',
        functionName: 'sendToken',
        abi: [
            {
                inputs: [
                    { internalType: 'address', name: '_to', type: 'address' },
                    {
                        internalType: 'uint256',
                        name: '_amount',
                        type: 'uint256',
                    },
                ],
                name: 'sendToken',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ] as const,
        getArgs: account => [account, BigInt(3_000_000 * 10 ** 18)],
    },
};

/**
 * Get the token contract address for a given currency.
 * Returns custom address if registered, otherwise uses SDK.
 */
export const getTokenContractAddress = async (
    ccy: CurrencySymbol,
    token: Token,
    sf: SecuredFinanceClient
): Promise<string> => {
    const custom = CUSTOM_FAUCETS[ccy];
    return custom
        ? custom.tokenAddress
        : await sf.getERC20TokenContractAddress(token);
};

/**
 * Mint tokens using appropriate faucet mechanism.
 * Custom faucets take precedence over standard TokenFaucet.
 */
export const mintTokens = async (
    ccy: CurrencySymbol,
    token: Token,
    account: Address,
    sf: SecuredFinanceClient,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client: any
): Promise<Address> => {
    const custom = CUSTOM_FAUCETS[ccy];

    if (custom) {
        return client.writeContract({
            address: custom.faucetAddress,
            abi: custom.abi,
            functionName: custom.functionName,
            args: custom.getArgs(account),
        });
    }

    return sf.mintERC20Token(token);
};
