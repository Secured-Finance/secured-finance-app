import classNames from 'classnames';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    AssetInformation,
    Button,
    CollateralInformationTable,
    CollateralManagementConciseTab,
} from 'src/components/atoms';
import { CollateralBook, useCollateralCurrencies } from 'src/hooks';
import { RootState } from 'src/store/types';
import {
    CurrencySymbol,
    ZERO_BI,
    amountFormatterFromBase,
    usdFormat,
} from 'src/utils';

interface CollateralTabLeftPaneProps {
    account: string | undefined;
    onClick: (step: 'deposit' | 'withdraw') => void;
    collateralBook: CollateralBook;
}

const getInformationText = (collateralCurrencies: CurrencySymbol[]) => {
    let article = '';
    let currencyString = '';

    const length = collateralCurrencies.length;

    if (length === 1) {
        currencyString = collateralCurrencies[0];
        article = 'is';
    } else {
        for (let i = 0; i < length - 1; i++) {
            currencyString += collateralCurrencies[i];
            if (i === length - 2) {
                currencyString += ' and ';
            } else {
                currencyString += ', ';
            }
        }
        currencyString += collateralCurrencies[length - 1];
        article = 'are';
    }
    return `Only ${currencyString} ${article} eligible as collateral.`;
};

const checkAssetQuantityExist = (
    collateralBook: CollateralBook['collateral' | 'nonCollateral']
) => {
    let exist = false;
    collateralBook &&
        Object.values(collateralBook).forEach(quantity => {
            if (quantity !== ZERO_BI) {
                exist = true;
            }
        });
    return exist;
};

export const CollateralTabLeftPane = ({
    account,
    onClick,
    collateralBook,
}: CollateralTabLeftPaneProps) => {
    const chainError = useSelector(
        (state: RootState) => state.blockchain.chainError
    );

    const { data: collateralCurrencies = [] } = useCollateralCurrencies();

    const collateralQuantityExist = useMemo(() => {
        return checkAssetQuantityExist(collateralBook.collateral);
    }, [collateralBook.collateral]);
    const nonCollateralQuantityExist = useMemo(() => {
        return checkAssetQuantityExist(collateralBook.nonCollateral);
    }, [collateralBook.nonCollateral]);
    const vaultBalance = account
        ? collateralBook.usdCollateral +
          collateralBook.totalPresentValue +
          collateralBook.usdNonCollateral
        : 0;

    return (
        <div className='flex min-h-[400px] w-full flex-col border-white-10 tablet:w-64 tablet:border-r'>
            <div className='flex-grow tablet:border-b tablet:border-white-10'>
                <div className='m-6 flex flex-col gap-1'>
                    <span className='typography-body-2 h-6 w-fit text-slateGray'>
                        SF Vault
                    </span>
                    <span
                        data-testid='vault-balance'
                        className={classNames(
                            'w-fit font-secondary font-semibold text-white',
                            {
                                'text-xl': vaultBalance.toString().length <= 6,
                                'text-xl tablet:text-md':
                                    vaultBalance.toString().length > 6 &&
                                    vaultBalance.toString().length <= 9,
                                'text-md tablet:text-smd':
                                    vaultBalance.toString().length > 9,
                            }
                        )}
                    >
                        {usdFormat(vaultBalance, 2)}
                    </span>
                </div>
                {!account ? (
                    <div className='typography-caption ml-5 w-40 pt-2 text-grayScale'>
                        Connect your wallet to see your deposited collateral
                        balance.
                    </div>
                ) : (
                    <div>
                        <div className='mx-5 my-6 hidden flex-col gap-6 tablet:flex'>
                            {collateralQuantityExist && (
                                <AssetInformation
                                    header='Collateral Assets'
                                    informationText={getInformationText(
                                        collateralCurrencies
                                    )}
                                    collateralBook={collateralBook.collateral}
                                ></AssetInformation>
                            )}
                            {nonCollateralQuantityExist && (
                                <AssetInformation
                                    header='Non-collateral Assets'
                                    informationText='Not eligible as collateral'
                                    collateralBook={
                                        collateralBook.nonCollateral
                                    }
                                ></AssetInformation>
                            )}
                            {!collateralQuantityExist && (
                                <div className='typography-caption w-40 text-grayScale'>
                                    Deposit collateral from your connected
                                    wallet to enable lending service on Secured
                                    Finance.
                                </div>
                            )}
                        </div>
                        <div className='mx-3 mt-6 flex flex-col gap-3 tablet:hidden'>
                            <CollateralManagementConciseTab
                                collateralCoverage={
                                    collateralBook.coverage / 100
                                }
                                availableToBorrow={
                                    collateralBook.usdAvailableToBorrow
                                }
                                collateralThreshold={
                                    collateralBook.collateralThreshold
                                }
                                account={account}
                            />
                            {collateralQuantityExist && (
                                <CollateralInformationTable
                                    data={(
                                        Object.entries(
                                            collateralBook.collateral
                                        ) as [CurrencySymbol, bigint][]
                                    )
                                        .filter(
                                            ([_asset, quantity]) =>
                                                quantity !== ZERO_BI
                                        )
                                        .map(([asset, quantity]) => {
                                            return {
                                                asset: asset,
                                                quantity:
                                                    amountFormatterFromBase[
                                                        asset
                                                    ](quantity),
                                            };
                                        })}
                                    assetTitle='Collateral Asset'
                                />
                            )}
                            {nonCollateralQuantityExist && (
                                <CollateralInformationTable
                                    data={(
                                        Object.entries(
                                            collateralBook.nonCollateral
                                        ) as [CurrencySymbol, bigint][]
                                    )
                                        .filter(
                                            ([_asset, quantity]) =>
                                                quantity !== ZERO_BI
                                        )
                                        .map(([asset, quantity]) => {
                                            return {
                                                asset: asset,
                                                quantity:
                                                    amountFormatterFromBase[
                                                        asset
                                                    ](quantity),
                                            };
                                        })}
                                    assetTitle='Non-Collateral Asset'
                                />
                            )}
                            {!collateralQuantityExist && (
                                <div className='typography-caption gap-2 text-grayScale'>
                                    Deposit collateral from your connected
                                    wallet to enable lending service on Secured
                                    Finance.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className='flex h-24 flex-row items-center justify-center gap-4 px-6'>
                <Button
                    size='sm'
                    onClick={() => onClick('deposit')}
                    disabled={!account || chainError}
                    data-testid='deposit-collateral'
                    fullWidth={true}
                >
                    Deposit
                </Button>
                <Button
                    size='sm'
                    disabled={!account || vaultBalance <= 0 || chainError}
                    onClick={() => onClick('withdraw')}
                    data-testid='withdraw-collateral'
                    fullWidth={true}
                >
                    Withdraw
                </Button>
            </div>
        </div>
    );
};
