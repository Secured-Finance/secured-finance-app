import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    ErrorInfo,
    RadioGroupSelector,
    WalletSourceSelector,
} from 'src/components/atoms';
import {
    AssetSelector,
    CollateralUsageSection,
    TermSelector,
} from 'src/components/molecules';
import { OrderAction } from 'src/components/organisms';
import { CollateralBook, useBalances } from 'src/hooks';
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
import { MaturityOptionList, OrderSideMap } from 'src/types';
import {
    CurrencySymbol,
    ZERO_BI,
    amountFormatterFromBase,
    amountFormatterToBase,
    formatLoanValue,
    generateWalletSourceInformation,
    getAmountValidation,
    getCurrencyMapAsOptions,
    getTransformMaturityOption,
} from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';
import { useAccount } from 'wagmi';

export const LendingCard = ({
    collateralBook,
    maturitiesOptionList,
    marketPrice,
    delistedCurrencySet,
}: {
    collateralBook: CollateralBook;
    maturitiesOptionList: MaturityOptionList;
    marketPrice: number | undefined;
    delistedCurrencySet: Set<CurrencySymbol>;
}) => {
    const { currency, maturity, side, sourceAccount, amount } = useSelector(
        (state: RootState) => selectLandingOrderForm(state.landingOrderForm)
    );

    const dispatch = useDispatch();
    const { address } = useAccount();

    const assetPriceMap = useSelector((state: RootState) => getPriceMap(state));

    const assetList = useMemo(() => getCurrencyMapAsOptions(), []);

    const balanceRecord = useBalances();

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
                  collateralBook.nonCollateral[currency] ||
                      collateralBook.withdrawableCollateral[currency] ||
                      ZERO_BI
              );
    }, [
        balanceRecord,
        collateralBook.nonCollateral,
        collateralBook.withdrawableCollateral,
        currency,
        selectedWalletSource.source,
    ]);

    const marketValue = useMemo(
        () => LoanValue.fromPrice(marketPrice ?? 0, maturity),
        [marketPrice, maturity]
    );

    const handleCurrencyChange = useCallback(
        (v: CurrencySymbol) => {
            let formatFrom = (x: bigint) => Number(x);
            if (amountFormatterFromBase && amountFormatterFromBase[currency]) {
                formatFrom = amountFormatterFromBase[currency];
            }
            let formatTo = (x: number) => BigInt(x);
            if (amountFormatterToBase && amountFormatterToBase[v]) {
                formatTo = amountFormatterToBase[v];
            }
            dispatch(setAmount(formatTo(formatFrom(amount))));
            dispatch(setCurrency(v));
        },
        [amount, currency, dispatch]
    );

    const handleWalletSourceChange = (source: WalletSource) => {
        dispatch(setSourceAccount(source));
        const available =
            source === WalletSource.METAMASK
                ? balanceRecord[currency]
                : amountFormatterFromBase[currency](
                      collateralBook.nonCollateral[currency] ||
                          collateralBook.withdrawableCollateral[currency] ||
                          ZERO_BI
                  );
        const inputAmount =
            amount > amountFormatterToBase[currency](available)
                ? amountFormatterToBase[currency](available)
                : amount;
        dispatch(setAmount(inputAmount));
    };

    const orderAmount =
        amount > ZERO_BI
            ? amountFormatterFromBase[currency](amount)
            : undefined;

    return (
        <div className='w-[345px] flex-shrink-0 space-y-6 rounded-b-xl border border-panelStroke bg-transparent pb-7 shadow-deep'>
            <RadioGroupSelector
                options={Object.values(OrderSideMap)}
                selectedOption={OrderSideMap[side]}
                handleClick={option => {
                    dispatch(
                        setSide(
                            option === 'Borrow'
                                ? OrderSide.BORROW
                                : OrderSide.LEND
                        )
                    );
                    dispatch(setSourceAccount(WalletSource.METAMASK));
                }}
                variant='NavTab'
            />

            <div className='flex h-[480px] flex-col justify-between px-4'>
                <div className='flex flex-col gap-6'>
                    <div className='flex flex-col gap-1 pb-1 text-center'>
                        <span
                            className='typography-amount-large text-white'
                            data-testid='market-rate'
                        >
                            {formatLoanValue(marketValue, 'rate')}
                        </span>
                        <span className='typography-caption uppercase text-secondary7'>
                            Fixed Rate APR
                        </span>
                    </div>

                    <div className='space-y-1'>
                        <AssetSelector
                            options={assetList}
                            selected={selectedAsset}
                            priceList={assetPriceMap}
                            onAmountChange={v => dispatch(setAmount(v))}
                            initialValue={orderAmount}
                            amountFormatterMap={amountFormatterToBase}
                            onAssetChange={handleCurrencyChange}
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

                    {side === OrderSide.LEND && (
                        <WalletSourceSelector
                            optionList={walletSourceList}
                            selected={selectedWalletSource}
                            account={address ?? ''}
                            onChange={handleWalletSourceChange}
                        />
                    )}

                    {side === OrderSide.BORROW && (
                        <div className='px-2'>
                            <CollateralUsageSection
                                usdCollateral={collateralBook.usdCollateral}
                                collateralCoverage={Number(
                                    collateralBook.coverage
                                )}
                                currency={currency}
                                collateralThreshold={
                                    collateralBook.collateralThreshold
                                }
                            />
                        </div>
                    )}
                </div>
                <OrderAction
                    collateralBook={collateralBook}
                    loanValue={marketValue}
                    renderSide
                    validation={getAmountValidation(
                        amountFormatterFromBase[currency](amount),
                        balanceToLend,
                        side
                    )}
                    isCurrencyDelisted={delistedCurrencySet.has(currency)}
                />
            </div>
        </div>
    );
};
