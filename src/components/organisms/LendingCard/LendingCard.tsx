import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    BorrowLendSelector,
    ErrorInfo,
    WalletSourceSelector,
} from 'src/components/atoms';
import {
    AssetSelector,
    CollateralUsageSection,
    TermSelector,
} from 'src/components/molecules';
import { OrderAction } from 'src/components/organisms';
import { CollateralBook } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import {
    selectLandingOrderForm,
    setAmount,
    setCurrency,
    setMaturity,
    setSide,
    setSourceAccount,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { selectAllBalances } from 'src/store/wallet';
import { MaturityOptionList } from 'src/types';
import {
    CurrencySymbol,
    amountFormatterFromBase,
    amountFormatterToBase,
    formatLoanValue,
    generateWalletSourceInformation,
    getAmountValidation,
    getCurrencyMapAsList,
    getCurrencyMapAsOptions,
    getTransformMaturityOption,
} from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';
import { useAccount } from 'wagmi';

export const LendingCard = ({
    collateralBook,
    marketValue,
    maturitiesOptionList,
}: {
    collateralBook: CollateralBook;
    marketValue: LoanValue;
    maturitiesOptionList: MaturityOptionList;
}) => {
    const { currency, maturity, side, sourceAccount, amount } = useSelector(
        (state: RootState) => selectLandingOrderForm(state.landingOrderForm)
    );

    const dispatch = useDispatch();
    const { address: account } = useAccount();

    const shortNames = useMemo(
        () =>
            getCurrencyMapAsList().reduce<Record<string, CurrencySymbol>>(
                (acc, ccy) => ({
                    ...acc,
                    [ccy.name]: ccy.symbol,
                }),
                {}
            ),
        []
    );

    const assetPriceMap = useSelector((state: RootState) => getPriceMap(state));
    const assetList = useMemo(() => getCurrencyMapAsOptions(), []);

    const balanceRecord = useSelector((state: RootState) =>
        selectAllBalances(state)
    );

    const selectedTerm = useMemo(() => {
        return (
            maturitiesOptionList.find(option =>
                option.value.equals(new Maturity(maturity))
            ) || maturitiesOptionList[0]
        );
    }, [maturity, maturitiesOptionList]);

    const walletSourceList = useMemo(() => {
        return generateWalletSourceInformation(
            currency,
            balanceRecord[currency],
            collateralBook.withdrawableCollateral[currency] ||
                collateralBook.nonCollateral[currency]
        );
    }, [
        balanceRecord,
        collateralBook.nonCollateral,
        collateralBook.withdrawableCollateral,
        currency,
    ]);

    const selectedWalletSource = useMemo(() => {
        return (
            walletSourceList.find(w => w.source === sourceAccount) ||
            walletSourceList[0]
        );
    }, [sourceAccount, walletSourceList]);

    const selectedAsset = useMemo(() => {
        return assetList.find(option => option.value === currency);
    }, [currency, assetList]);

    const balanceToLend = useMemo(() => {
        return selectedWalletSource.source === WalletSource.METAMASK
            ? balanceRecord[currency]
            : amountFormatterFromBase[currency](
                  collateralBook.nonCollateral[currency] ?? BigNumber.from(0)
              );
    }, [
        balanceRecord,
        collateralBook.nonCollateral,
        currency,
        selectedWalletSource.source,
    ]);

    return (
        <div className='w-80 flex-col space-y-6 rounded-b-xl border border-panelStroke bg-transparent pb-6 shadow-deep'>
            <BorrowLendSelector
                handleClick={side => {
                    dispatch(setSide(side));
                    dispatch(setSourceAccount(WalletSource.METAMASK));
                }}
                side={side}
                variant='simple'
            />

            <div className='grid justify-center space-y-6 px-4'>
                <div className='flex flex-col text-center'>
                    <span
                        className='typography-amount-large text-white'
                        data-testid='market-rate'
                    >
                        {formatLoanValue(marketValue, 'rate')}
                    </span>
                    <span className='typography-caption uppercase text-planetaryPurple'>
                        Fixed Rate APR
                    </span>
                </div>

                <div className='space-y-1'>
                    <AssetSelector
                        options={assetList}
                        selected={selectedAsset}
                        transformLabel={(v: string) => shortNames[v]}
                        priceList={assetPriceMap}
                        onAmountChange={v => dispatch(setAmount(v))}
                        amountFormatterMap={amountFormatterToBase}
                        onAssetChange={(v: CurrencySymbol) => {
                            dispatch(setCurrency(v));
                        }}
                    />
                    {side === OrderSide.LEND && (
                        <ErrorInfo
                            showError={getAmountValidation(
                                amountFormatterFromBase[currency](amount),
                                balanceToLend,
                                side
                            )}
                            errorMessage='Insufficient amount in source'
                        />
                    )}
                </div>

                <TermSelector
                    options={maturitiesOptionList.map(o => ({
                        ...o,
                        value: o.value.toString(),
                    }))}
                    selected={{
                        ...selectedTerm,
                        value: selectedTerm.value.toString(),
                    }}
                    onTermChange={v => dispatch(setMaturity(Number(v)))}
                    transformLabel={getTransformMaturityOption(
                        maturitiesOptionList.map(o => ({
                            ...o,
                            value: o.value.toString(),
                        }))
                    )}
                />

                {account && side === OrderSide.LEND && (
                    <WalletSourceSelector
                        optionList={walletSourceList}
                        selected={selectedWalletSource}
                        account={account ?? ''}
                        onChange={v => dispatch(setSourceAccount(v))}
                    />
                )}

                {side === OrderSide.BORROW && (
                    <CollateralUsageSection
                        usdCollateral={collateralBook.usdCollateral}
                        collateralCoverage={collateralBook.coverage.toNumber()}
                        currency={currency}
                        collateralThreshold={collateralBook.collateralThreshold}
                    />
                )}

                <OrderAction
                    collateralBook={collateralBook}
                    loanValue={marketValue}
                    renderSide
                    validation={getAmountValidation(
                        amountFormatterFromBase[currency](amount),
                        balanceToLend,
                        side
                    )}
                />
            </div>
        </div>
    );
};
