import { track } from '@amplitude/analytics-browser';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { Token } from '@secured-finance/sf-core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import MetaMaskIcon from 'src/assets/img/metamask-fox.svg';

import {
    Button,
    DropdownSelector,
    GradientBox,
    Separator,
} from 'src/components/atoms';
import { Dialog, SuccessPanel } from 'src/components/molecules';
import { ConnectWalletCard, MyWalletCard } from 'src/components/organisms';
import { Page, TwoColumns } from 'src/components/templates';
import useSF from 'src/hooks/useSecuredFinance';
import {
    AddressUtils,
    CurrencySymbol,
    WalletSource,
    getCurrencyMapAsList,
    getCurrencyMapAsOptions,
    handleContractTransaction,
    toCurrency,
} from 'src/utils';
import { useWallet } from 'use-wallet';

export const Faucet = () => {
    const { account, ethereum } = useWallet();
    const sf = useSF();

    const assetList = useMemo(
        () =>
            getCurrencyMapAsOptions().filter(
                option => toCurrency(option.value).isToken
            ),
        []
    );

    const [ccy, setCcy] = useState<CurrencySymbol | null>(null);
    const [address, setAddress] = useState<string>('');
    const [isPending, setIsPending] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const token = useMemo(() => {
        if (!ccy) return null;
        const currency = toCurrency(ccy);
        if (currency instanceof Token) {
            return currency;
        }

        return null;
    }, [ccy]);

    const mint = useCallback(async () => {
        if (!account || !sf || !token || !(token instanceof Token)) return;
        setIsPending(true);
        try {
            const tx = await sf.mintERC20Token(token);
            const transactionStatus = await handleContractTransaction(tx);

            if (!transactionStatus) {
                console.error('Some error occurred');
            } else {
                track('Mint Tokens', {
                    'Asset Type': token.symbol,
                });
                setIsOpen(true);
            }
        } catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
            }
        }
        setIsPending(false);
    }, [account, token, sf]);

    const addToMetamask = useCallback(
        async (token: Token | null) => {
            if (!account || !token) return;
            await ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: token.address,
                        symbol: token.symbol,
                        decimals: token.decimals,
                    },
                },
            });
        },
        [account, ethereum]
    );

    useEffect(() => {
        const getContractAddress = async () => {
            if (!sf || !token || !(token instanceof Token)) return '';
            const address = await sf.getERC20TokenContractAddress(token);
            return address;
        };

        getContractAddress().then(address => {
            setAddress(address);
        });
    }, [sf, token]);

    return (
        <Page title='Test Pilot Program'>
            <TwoColumns>
                <GradientBox>
                    <div className='grid grid-cols-1 gap-12 px-5 pb-4 desktop:px-[70px]'>
                        <h1 className='typography-headline-4 py-8 text-center text-2xl font-bold text-white'>
                            Test Token Faucet
                        </h1>
                        <div className='flex flex-col gap-10'>
                            <div className='grid h-14 grid-flow-col items-center justify-between gap-x-3 rounded-xl border border-neutral-3 bg-black-20 px-2'>
                                <DropdownSelector
                                    optionList={assetList}
                                    selected={assetList[0]}
                                    onChange={ccy => {
                                        if (
                                            getCurrencyMapAsList()
                                                .map(item =>
                                                    item.symbol.toString()
                                                )
                                                .includes(ccy)
                                        ) {
                                            setCcy(ccy as CurrencySymbol);
                                        } else {
                                            setCcy(null);
                                        }
                                    }}
                                />
                                <div className='typography-caption text-white-60 tablet:pr-10'>
                                    <span className='hidden tablet:inline'>
                                        {address}
                                    </span>
                                    <span className='inline tablet:hidden'>
                                        {AddressUtils.format(address, 6)}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(address);
                                    }}
                                >
                                    <ClipboardDocumentIcon className='h-4 w-4 text-slateGray hover:text-slateGray/80' />
                                </button>
                            </div>
                            <div className='grid h-14 grid-flow-col items-center justify-between gap-x-3 rounded-xl border border-neutral-3 bg-black-20 px-2'>
                                <button
                                    className='flex h-10 w-36 flex-row items-center justify-start gap-x-2 rounded-lg bg-white-5 px-2 hover:bg-white-40'
                                    onClick={() => addToMetamask(token)}
                                >
                                    <span>
                                        <MetaMaskIcon className='h-6 w-6' />
                                    </span>
                                    <span className='typography-caption w-20 whitespace-nowrap pl-2 text-left text-white'>
                                        Wallet
                                    </span>
                                </button>
                                <div className='typography-caption text-white-60 tablet:pr-10'>
                                    <span className='inline tablet:hidden'>
                                        {account
                                            ? AddressUtils.format(account, 6)
                                            : ''}
                                    </span>
                                    <span className='hidden tablet:inline'>
                                        {account ?? ''}
                                    </span>
                                </div>
                                <div></div>
                            </div>
                            <div className='flex justify-center'>
                                <Button onClick={mint} disabled={isPending}>
                                    {isPending ? 'Minting...' : 'Mint tokens'}
                                </Button>
                            </div>
                        </div>
                        <Separator />
                        <div className='typography-body-2 flex flex-col gap-4 pt-5 text-planetaryPurple'>
                            <h1 className='text-neutral-8'>
                                How does it work?
                            </h1>
                            <p>
                                Welcome to the Secured Finance ERC20 token
                                faucet! Connect to our DeFi dApp and request
                                some tokens for testing purposes. These tokens
                                have no real value and are provided for testing
                                only. Please use them responsibly and only
                                request what you need.
                            </p>
                            <p>
                                Please note that your wallet will require
                                initial ethereum balance in your metamask wallet
                                to cover the gas cost to receive our test
                                tokens. You can receive testnet ethereum from
                                the{' '}
                                <a
                                    className='text-nebulaTeal underline'
                                    href='https://sepolia-faucet.pk910.de/'
                                    target='_blank'
                                    rel='noreferrer'
                                >
                                    Sepolia PoW Faucet
                                </a>
                                .
                            </p>
                            <p>Thank you for choosing Secured Finance!</p>
                            <h1 className='pt-2 text-neutral-8'>
                                Add our ERC20 Tokens to Metamask
                            </h1>
                            <p>
                                You can add our ERC20 tokens to Metamask by
                                following{' '}
                                <a
                                    href='https://metamask.zendesk.com/hc/en-us/articles/360015489031-How-to-display-tokens-in-MetaMask#h_01FWH492CHY60HWPC28RW0872H'
                                    target='_blank'
                                    rel='noreferrer'
                                    className='text-nebulaTeal'
                                >
                                    this guide
                                </a>
                            </p>
                        </div>
                    </div>
                </GradientBox>
                {account ? (
                    <MyWalletCard
                        information={{
                            [WalletSource.METAMASK]: assetList.map(
                                ccy => ccy.value
                            ),
                        }}
                        addressRecord={{
                            [WalletSource.METAMASK]: account ?? '',
                        }}
                    />
                ) : (
                    <ConnectWalletCard />
                )}
            </TwoColumns>
            <Dialog
                isOpen={isOpen}
                title='Token minted'
                description=''
                callToAction='OK'
                onClose={() => setIsOpen(false)}
                onClick={() => setIsOpen(false)}
            >
                <SuccessPanel
                    itemList={[
                        ['Status', 'Success'],
                        [
                            'Ethereum Address',
                            AddressUtils.format(account ?? '', 16),
                        ],
                    ]}
                />
            </Dialog>
        </Page>
    );
};
