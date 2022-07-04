import { LendingCard } from 'src/components/organisms';
import { useCollateralBook, usePlaceOrder } from 'src/hooks';
import { useWallet } from 'use-wallet';

export const Landing = () => {
    const { account, chainId } = useWallet();
    const { placeOrder } = usePlaceOrder();
    const collateralBook = useCollateralBook(
        account ? account : '',
        chainId ? chainId : 1
    );

    return (
        <div
            className='flex-col items-center space-y-24 py-24'
            role='main'
            data-cy='lending-page'
        >
            <div className='flex flex-col items-center justify-center space-y-8 text-center'>
                <h1 className='typography-headline-1 text-white'>
                    Interbank-grade Lending <br />
                    Now Democratized
                </h1>
                <h2 className='typography-body-2 w-1/3 text-white-80'>
                    An elegant open-market digital asset lending solution
                    offering interoperability with traditional banking and
                    decentralization via Web3
                </h2>
            </div>
            <div className='flex flex-row justify-center space-x-8'>
                <LendingCard
                    onPlaceOrder={placeOrder}
                    collateralBook={collateralBook}
                />
                <div className='w-[700px] bg-gunMetal text-3xl text-white'>
                    account: {account}
                </div>
            </div>
        </div>
    );
};
