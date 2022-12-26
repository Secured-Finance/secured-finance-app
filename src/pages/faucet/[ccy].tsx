import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Button,
    HorizontalListItem,
    SectionWithItems,
} from 'src/components/atoms';
import { AmountCard } from 'src/components/molecules';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { AddressUtils, currencyMap, CurrencySymbol } from 'src/utils';
import { useWallet } from 'use-wallet';

const Faucet = () => {
    const { account } = useWallet();
    const [isPending, setIsPending] = useState(false);
    const [txHash, setTxHash] = useState('');
    const [error, setError] = useState('');
    const [balance, setBalance] = useState(0);
    const [asset, setAsset] = useState<CurrencySymbol>(CurrencySymbol.ETH);
    const [price, setPrice] = useState(0);

    const router = useRouter();
    const { ccy } = router.query;

    const priceList = useSelector((state: RootState) => getPriceMap(state));

    const getBalance = useCallback(async () => {
        if (!account) return;
        const balance = 0;
        //await getBalanceOf(account);
        setBalance(balance);
    }, [account]);

    const mint = useCallback(async () => {
        if (!account) return;
        setIsPending(true);
        setError('');
        try {
            const tx = {
                hash: '0x',
            };
            //await sendFundsTo(account);
            setTxHash(tx.hash);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
        }
        setIsPending(false);
    }, [account]);

    useEffect(() => {
        getBalance();
    }, [getBalance]);

    useEffect(() => {
        const asset = ccy?.toString().toUpperCase();
        if (!currencyMap[asset as CurrencySymbol]) {
            setError('Invalid currency');
        } else {
            setAsset(asset as CurrencySymbol);
            setPrice(priceList[asset as CurrencySymbol]);
            setError('');
        }
    }, [ccy, priceList]);

    return (
        <>
            <div className='flex justify-center pt-6'>
                <div
                    className='grid w-2/5
                 grid-cols-1 content-center gap-5 text-grayScale'
                >
                    <h1 className='typography-hero text-center'>Faucet</h1>
                    <h2 className='typography-caption'>Balance:</h2>
                    <AmountCard amount={balance} ccy={asset} price={price} />
                    <SectionWithItems
                        itemList={[
                            [
                                'Account',
                                account ? AddressUtils.format(account, 6) : '',
                            ],
                            [
                                'Contract',
                                '0x0000000000000000000000000000000000000000',
                            ],
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
            <div className=' flex justify-center pt-10'>
                <div className='w-3/5'>
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
            </div>
        </>
    );
};

export default Faucet;
