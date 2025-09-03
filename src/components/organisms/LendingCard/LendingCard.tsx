import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { useCallback, useMemo } from 'react';
import { ErrorInfo, WalletSourceSelector } from 'src/components/atoms';
import {
    AssetSelector,
    CollateralUsageSection,
    TabGroup,
    TermSelector,
} from 'src/components/molecules';
import { OrderAction } from 'src/components/organisms';
import {
    CollateralBook,
    useBalances,
    useBorrowableAmount,
    useCurrencies,
    useLastPrices,
} from 'src/hooks';
import {
    useLandingOrderFormSelector,
    useLandingOrderFormStore,
} from 'src/store/landingOrderForm';
import { MaturityOptionList, OrderSideMap } from 'src/types';
import {
    ButtonEvents,
    ButtonProperties,
    CurrencySymbol,
    ZERO_BI,
    amountFormatterFromBase,
    amountFormatterToBase,
    formatLoanValue,
    generateWalletSourceInformation,
    getAmountValidation,
    getTransformMaturityOption,
    toOptions,
} from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';
import { trackButtonEvent } from 'src/utils/events';
import { useAccount } from 'wagmi';
import { orderSideOptions } from './constants';

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
    const { currency, amount, amountExists, maturity, side, sourceAccount } =
        useLandingOrderFormSelector();

    const { setCurrency, setMaturity, setSide, setAmount, setSourceAccount } =
        useLandingOrderFormStore();
    const { address } = useAccount();

    const { data: assetPriceMap } = useLastPrices();
    const { data: currencies } = useCurrencies();
    const assetList = toOptions(currencies, currency);

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

    const availableToLend = useMemo(() => {
        return selectedWalletSource.source === WalletSource.METAMASK
            ? balanceRecord[currency]
            : collateralBook.nonCollateral[currency] ||
                  collateralBook.withdrawableCollateral[currency] ||
                  ZERO_BI;
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
            setCurrency(v);
        },
        [setCurrency]
    );

    const handleWalletSourceChange = (source: WalletSource) => {
        setSourceAccount(source);
        const available =
            source === WalletSource.METAMASK
                ? balanceRecord[currency]
                : collateralBook.nonCollateral[currency] ||
                  collateralBook.withdrawableCollateral[currency] ||
                  ZERO_BI;
        const inputAmount = amount > available ? available : amount;
        setAmount(inputAmount.toString());
    };

    const { data: availableToBorrow } = useBorrowableAmount(address, currency);

    const canPlaceOrder = useMemo(() => {
        if (side === OrderSide.BORROW) {
            return availableToBorrow > 0 && availableToBorrow >= amount;
        } else {
            return availableToLend > 0 && availableToLend >= amount;
        }
    }, [amount, availableToBorrow, availableToLend, side]);

    return (
        <div className='w-[345px] flex-shrink-0 space-y-6 rounded-b-xl border border-panelStroke bg-transparent pb-7 shadow-deep'>
            <TabGroup
                options={orderSideOptions}
                selectedOption={OrderSideMap[side]}
                handleClick={option => {
                    setSide(
                        option === 'Borrow' ? OrderSide.BORROW : OrderSide.LEND
                    );
                    setSourceAccount(WalletSource.METAMASK);
                    trackButtonEvent(
                        ButtonEvents.ORDER_SIDE,
                        ButtonProperties.ORDER_SIDE,
                        option
                    );
                }}
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
                            onAmountChange={v =>
                                setAmount(
                                    v === ''
                                        ? ''
                                        : amountFormatterToBase[currency](
                                              Number(v)
                                          ).toString()
                                )
                            }
                            initialValue={
                                amountExists
                                    ? amountFormatterFromBase[currency](
                                          amount
                                      ).toString()
                                    : ''
                            }
                            onAssetChange={v => {
                                handleCurrencyChange(v);
                                trackButtonEvent(
                                    ButtonEvents.CURRENCY_CHANGE,
                                    ButtonProperties.CURRENCY,
                                    v
                                );
                            }}
                        />
                        {side === OrderSide.LEND && (
                            <ErrorInfo
                                showError={getAmountValidation(
                                    amount,
                                    availableToLend,
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
                        onTermChange={v => {
                            setMaturity(Number(v));
                            trackButtonEvent(
                                ButtonEvents.TERM_CHANGE,
                                ButtonProperties.TERM,
                                selectedTerm.label
                            );
                        }}
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
                                collateralCoverage={collateralBook.coverage}
                                currency={currency}
                                availableToBorrow={availableToBorrow}
                            />
                        </div>
                    )}
                </div>
                <OrderAction
                    collateralBook={collateralBook}
                    loanValue={marketValue}
                    renderSide
                    validation={false}
                    isCurrencyDelisted={delistedCurrencySet.has(currency)}
                    canPlaceOrder={canPlaceOrder}
                />
            </div>
        </div>
    );
};
