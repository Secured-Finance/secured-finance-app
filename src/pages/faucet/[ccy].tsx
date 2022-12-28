import { Token } from '@secured-finance/sf-core';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Button,
    HorizontalListItem,
    SectionWithItems,
} from 'src/components/atoms';
import { AmountCard, Dialog, SuccessPanel } from 'src/components/molecules';
import useSF from 'src/hooks/useSecuredFinance';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import {
    AddressUtils,
    currencyMap,
    CurrencySymbol,
    handleContractTransaction,
} from 'src/utils';
import { useWallet } from 'use-wallet';

const Faucet = () => {
    const { account } = useWallet();
    const [isPending, setIsPending] = useState(false);
    const [txHash, setTxHash] = useState('');
    const [error, setError] = useState('');
    const [balance, setBalance] = useState(0);
    const [address, setAddress] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const sf = useSF();
    const router = useRouter();
    const { ccy } = router.query;

    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const block = useSelector(
        (state: RootState) => state.blockchain.latestBlock
    );

    const token = useMemo(() => {
        if (!ccy) return null;
        const asset = ccy.toString().toUpperCase();
        if (!asset) {
            setError('Invalid currency');
            return null;
        }
        const currency = currencyMap[asset as CurrencySymbol]?.toCurrency();
        if (!currency) {
            setError('Invalid currency');
            return null;
        }
        if (currency instanceof Token) {
            return currency;
        }

        setError('Invalid currency');
        return null;
    }, [ccy]);

    const getBalance = useCallback(async () => {
        if (!account || !sf || !token) return;
        const balance = await sf.getERC20Balance(token, account);
        setBalance(
            currencyMap[token.symbol as CurrencySymbol]
                ? currencyMap[token.symbol as CurrencySymbol].fromBaseUnit(
                      balance
                  )
                : 0
        );
    }, [account, sf, token]);

    useEffect(() => {
        const getContractAddress = async () => {
            if (!sf || !token) return '';
            const address = await sf.getERC20TokenContractAddress(token);
            return address;
        };

        getContractAddress().then(address => {
            setAddress(address);
        });
    }, [sf, token]);

    const mint = useCallback(async () => {
        if (!account || !token || !sf) return;

        setIsPending(true);
        setError('');
        try {
            const tx = await sf.mintERC20Token(token);
            const transactionStatus = await handleContractTransaction(tx);
            setTxHash(tx.hash);

            if (!transactionStatus) {
                console.error('Some error occurred');
            } else {
                setIsOpen(true);
            }
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
        }
        setIsPending(false);
    }, [account, token, sf]);

    useEffect(() => {
        getBalance();
    }, [getBalance, block]);

    return (
        <>
            <div className='flex justify-center pt-6'>
                <div
                    className='grid w-2/5
                 grid-cols-1 content-center gap-5 text-grayScale'
                >
                    <h1 className='typography-hero text-center'>Faucet</h1>
                    <h2 className='typography-caption'>Balance:</h2>
                    {token ? (
                        <AmountCard
                            amount={balance}
                            ccy={token.symbol as CurrencySymbol}
                            price={priceList[token.symbol as CurrencySymbol]}
                        />
                    ) : null}
                    <SectionWithItems
                        itemList={[
                            [
                                'Account',
                                account ? AddressUtils.format(account, 6) : '',
                            ],
                            ['Contract', address],
                        ]}
                    />

                    <div className='flex justify-center'>
                        <Button onClick={mint} disabled={isPending}>
                            {isPending ? 'Sending...' : 'Mint tokens'}
                        </Button>
                    </div>

                    {txHash && (
                        <HorizontalListItem
                            label='Transaction hash'
                            value={AddressUtils.format(txHash, 6)}
                        />
                    )}
                    {error && (
                        <HorizontalListItem label='Error' value={error} />
                    )}
                </div>
            </div>
            <div className='flex flex-col items-center justify-center pt-10'>
                <div className='w-3/5 pt-4'>
                    <h1 className='typography-modal-title py-2 text-planetaryPurple'>
                        How does it work?
                    </h1>
                    <p className='typography-body-2 text-neutral-8'>
                        Welcome to the Secured Finance ERC20 token faucet!
                        Connect to our DeFi dApp and request some tokens for
                        testing purposes. These tokens have no real value and
                        are provided for testing only. Please use them
                        responsibly and only request what you need. Thank you
                        for choosing Secured Finance!
                    </p>
                </div>
                <div className='w-3/5 pt-4'>
                    <h1 className='typography-modal-title py-2 text-planetaryPurple'>
                        Add our ERC20 Tokens to Metamask
                    </h1>
                    <p className='typography-body-2 text-neutral-8'>
                        You can add our ERC20 tokens to Metamask by following{' '}
                        <a
                            href='https://metamask.zendesk.com/hc/en-us/articles/360015489031-How-to-display-tokens-in-MetaMask#h_01FWH492CHY60HWPC28RW0872H'
                            target='_blank'
                            rel='noreferrer'
                            className='ypography-modal-title text-md text-galacticOrange hover:bg-galacticOrange hover:text-grayScale'
                        >
                            this guide
                        </a>
                    </p>
                </div>
            </div>
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
        </>
    );
};

export default Faucet;
