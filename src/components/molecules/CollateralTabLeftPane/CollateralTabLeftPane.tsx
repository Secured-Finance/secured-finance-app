import { AssetInformation, Button } from 'src/components/atoms';
import { CollateralBook } from 'src/hooks';
import { usdFormat } from 'src/utils';

interface CollateralTabLeftPaneProps {
    account: string | null;
    onClick: (step: 'deposit' | 'withdraw') => void;
    collateralBook: CollateralBook;
}

export const CollateralTabLeftPane = ({
    account,
    onClick,
    collateralBook,
}: CollateralTabLeftPaneProps) => {
    const collateralBalance = account ? collateralBook.usdCollateral : 0;
    const nonCollateralBalance = account ? collateralBook.usdNonCollateral : 0;

    return (
        <div className='flex w-64 flex-col border-r border-white-10'>
            <div className='h-full border-b border-white-10'>
                <div className='m-6 flex flex-col gap-1'>
                    <span className='typography-body-2 h-6 w-fit text-slateGray'>
                        Collateral Balance
                    </span>
                    <span className='typography-big-body-bold w-fit text-white'>
                        {usdFormat(collateralBalance, 2)}
                    </span>
                </div>
                {!account ? (
                    <div className='typography-caption ml-5 w-40 pt-2 text-grayScale'>
                        Connect your wallet to see your deposited collateral
                        balance.
                    </div>
                ) : collateralBalance > 0 ? (
                    <div className='mx-5 my-6 flex flex-col gap-6'>
                        <AssetInformation
                            header='Collateral Assets'
                            informationText='Only USDC and ETH are eligible as collateral.'
                            collateralBook={collateralBook.collateral}
                        ></AssetInformation>
                        {nonCollateralBalance > 0 && (
                            <AssetInformation
                                header='Non-collateral Assets'
                                informationText='Not eligible as collateral'
                                collateralBook={collateralBook.nonCollateral}
                            ></AssetInformation>
                        )}
                    </div>
                ) : (
                    <div className='typography-caption ml-5 w-40 text-grayScale'>
                        Deposit collateral from your connected wallet to enable
                        lending service on Secured Finance.
                    </div>
                )}
            </div>
            <div className='flex h-24 flex-row items-center justify-center gap-4'>
                <Button
                    size='sm'
                    onClick={() => onClick('deposit')}
                    disabled={!account}
                    data-testid='deposit-collateral'
                >
                    Deposit
                </Button>
                <Button
                    size='sm'
                    disabled={!account || collateralBalance <= 0}
                    onClick={() => onClick('withdraw')}
                    data-testid='withdraw-collateral'
                >
                    Withdraw
                </Button>
            </div>
        </div>
    );
};
