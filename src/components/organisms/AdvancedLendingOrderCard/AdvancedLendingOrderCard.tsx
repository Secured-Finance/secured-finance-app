import { track } from '@amplitude/analytics-browser';
import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { VisibilityState } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    CollateralManagementConciseTab,
    ErrorInfo,
    OrderDisplayBox,
    OrderInputBox,
    Slider,
    TabVariant,
} from 'src/components/atoms';
import { SubtabGroup, TabGroup } from 'src/components/molecules';
import { NewOrderBookWidget, OrderAction } from 'src/components/organisms';
import {
    CollateralBook,
    useBalances,
    useBorrowableAmount,
    useBreakpoint,
    useLastPrices,
    useMarket,
    useOrderFee,
} from 'src/hooks';
import { useOrderbook } from 'src/hooks/useOrderbook';
import {
    resetUnitPrice,
    selectLandingOrderForm,
    setAmount,
    setOrderType,
    setSide,
    setUnitPrice,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { OrderSideMap, OrderType, OrderTypeOptions } from 'src/types';
import {
    ButtonEvents,
    ButtonProperties,
    CurrencySymbol,
    ZERO_BI,
    amountFormatterFromBase,
    amountFormatterToBase,
    calculateFee,
    currencyMap,
    divide,
    formatLoanValue,
    generateWalletSourceInformation,
    multiply,
    ordinaryFormat,
    usdFormat,
} from 'src/utils';
import { Amount, LoanValue } from 'src/utils/entities';
import {
    InteractionEvents,
    InteractionProperties,
    trackButtonEvent,
} from 'src/utils/events';
import { useAccount } from 'wagmi';

const getOrderSideText = (
    side: (typeof OrderSideMap)[OrderSide.LEND | OrderSide.BORROW]
) => {
    if (side === 'Lend') return 'Lend/Buy';
    return 'Borrow/Sell';
};

export function AdvancedLendingOrderCard({
    collateralBook,
    isItayose = false,
    calculationDate,
    preOrderPosition = 'none',
    marketPrice,
    delistedCurrencySet,
}: {
    collateralBook: CollateralBook;
    isItayose?: boolean;
    calculationDate?: number;
    preOrderPosition?: 'borrow' | 'lend' | 'none';
    marketPrice?: number;
    delistedCurrencySet: Set<CurrencySymbol>;
}): JSX.Element {
    const {
        currency,
        amount,
        side,
        orderType,
        unitPrice,
        maturity,
        sourceAccount,
        amountExists,
        unitPriceExists,
    } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

    const [orderBook, setMultiplier, setIsShowingAll] = useOrderbook(
        currency,
        maturity
    );

    const { data: orderFee = 0 } = useOrderFee(currency);

    const { address, isConnected } = useAccount();

    const [sliderValue, setSliderValue] = useState(0.0);

    const balanceRecord = useBalances();
    const isTablet = useBreakpoint('laptop');
    const isMobile = useBreakpoint('tablet');

    const midPrice = useMemo(() => {
        if (
            orderBook.data &&
            orderBook.data.borrowOrderbook &&
            orderBook.data.lendOrderbook
        ) {
            const borrowPrice = orderBook.data.borrowOrderbook[0].value.price;
            const lendPrice = orderBook.data.lendOrderbook[0].value.price;
            return divide(borrowPrice + lendPrice, 200.0, 2);
        }
        return undefined;
    }, [orderBook.data]);

    const loanValue = useMemo(() => {
        if (!maturity) return LoanValue.ZERO;
        if (unitPrice !== undefined && unitPriceExists) {
            return LoanValue.fromPrice(
                unitPrice * 100.0,
                maturity,
                calculationDate
            );
        }
        if (!marketPrice) return LoanValue.ZERO;
        return LoanValue.fromPrice(marketPrice, maturity, calculationDate);
    }, [maturity, unitPrice, unitPriceExists, marketPrice, calculationDate]);

    const unitPriceValue = useMemo(() => {
        if (!maturity) return undefined;
        if (!unitPriceExists) {
            return undefined;
        } else if (unitPrice !== undefined) {
            return unitPrice.toString();
        }
        if (!marketPrice) return undefined;
        if (!isConnected) return undefined;
        return (marketPrice / 100.0).toString();
    }, [maturity, marketPrice, unitPrice, isConnected, unitPriceExists]);

    const dispatch = useDispatch();

    const collateralUsagePercent = useMemo(() => {
        return collateralBook.coverage / 100.0;
    }, [collateralBook]);

    const totalCollateralInUSD = address ? collateralBook.usdCollateral : 0;

    const { data: priceList } = useLastPrices();
    const price = priceList[currency];

    const market = useMarket(currency, maturity);
    const marketUnitPrice = market?.marketUnitPrice;
    const openingUnitPrice = market?.openingUnitPrice;

    const currentMarket = useMemo(() => {
        if (marketUnitPrice) {
            return {
                value: LoanValue.fromPrice(marketUnitPrice, maturity),
                time: market?.lastBlockUnitPriceTimestamp ?? 0,
                type: 'block' as const,
            };
        }
        if (openingUnitPrice) {
            return {
                value: LoanValue.fromPrice(openingUnitPrice, maturity),
                time: 0,
                type: 'opening' as const,
            };
        }
    }, [
        market?.lastBlockUnitPriceTimestamp,
        marketUnitPrice,
        maturity,
        openingUnitPrice,
    ]);

    const orderAmount = amount > 0 ? new Amount(amount, currency) : undefined;

    const { data: availableToBorrow } = useBorrowableAmount(address, currency);

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

    const handleSliderChange = (percentage: number) => {
        const available =
            side === OrderSide.BORROW ? availableToBorrow : availableToLend;
        track(InteractionEvents.SLIDER, {
            [InteractionProperties.SLIDER_VALUE]: percentage,
        });
        dispatch(
            setAmount(
                ((BigInt(percentage) * available) / BigInt(100)).toString()
            )
        );
        setSliderValue(percentage);
    };

    const canPlaceOrder = useMemo(() => {
        if (side === OrderSide.BORROW) {
            return availableToBorrow > 0 && availableToBorrow >= amount;
        } else {
            return availableToLend > 0 && availableToLend >= amount;
        }
    }, [amount, availableToBorrow, availableToLend, side]);

    const handleInputChange = (v: string) => {
        const inputValue = amountFormatterToBase[currency](Number(v));

        dispatch(setAmount(v === '' ? '' : inputValue.toString()));
        const available =
            side === OrderSide.BORROW ? availableToBorrow : availableToLend;

        if (available > 0) {
            const percentage = (inputValue * BigInt(100)) / available;
            setSliderValue(
                Number(percentage > BigInt(100) ? BigInt(100) : percentage)
            );
        } else {
            setSliderValue(0);
        }
    };

    useEffect(() => {
        if (isItayose) {
            dispatch(setOrderType(OrderType.LIMIT));
        }
    }, [dispatch, isItayose]);

    const isInvalidBondPrice = unitPrice === 0 && orderType === OrderType.LIMIT;
    const isLendingSide = side === OrderSide.LEND;

    const showPreOrderError =
        isItayose &&
        ((preOrderPosition === 'borrow' && isLendingSide) ||
            (preOrderPosition === 'lend' && !isLendingSide));

    const shouldDisableActionButton = isInvalidBondPrice || showPreOrderError;

    const isMarketOrderType = orderType === OrderType.MARKET;

    const isBondPriceFieldDisabled = isMarketOrderType || !isConnected;

    const handleFilterChange = useCallback(
        (state: VisibilityState) => {
            setIsShowingAll(state.showBorrow && state.showLend);
        },
        [setIsShowingAll]
    );

    const orderSideOptions = Object.values(OrderSideMap).map(option => ({
        text: getOrderSideText(option),
        variant: TabVariant[option],
    }));

    const calculateFutureValue = useCallback(
        (amount: bigint, unitPrice: number) => {
            if (unitPrice === 0) {
                return 0;
            }
            return divide(
                multiply(
                    amountFormatterFromBase[currency](amount),
                    100,
                    currencyMap[currency].roundingDecimal
                ),
                unitPrice,
                currencyMap[currency].roundingDecimal
            );
        },
        [currency]
    );

    return (
        <div className='h-full rounded-b-xl border-neutral-600 bg-neutral-900 pb-7 laptop:border'>
            <div className='h-11 border-b border-neutral-600 laptop:h-[60px]'>
                <TabGroup
                    options={orderSideOptions}
                    selectedOption={getOrderSideText(OrderSideMap[side])}
                    handleClick={option => {
                        dispatch(
                            setSide(
                                option === 'Borrow/Sell'
                                    ? OrderSide.BORROW
                                    : OrderSide.LEND
                            )
                        );
                        trackButtonEvent(
                            ButtonEvents.ORDER_SIDE,
                            ButtonProperties.ORDER_SIDE,
                            option
                        );
                    }}
                    isFullHeight
                />
            </div>

            <div className='grid w-full grid-cols-12 gap-5 px-4 pb-8 pt-2.5 laptop:gap-0 laptop:pb-2 laptop:pt-2'>
                <div className='col-span-7 flex flex-col justify-start gap-2.5 laptop:col-span-12 laptop:gap-2'>
                    {!isItayose && (
                        <SubtabGroup
                            options={OrderTypeOptions}
                            selectedOption={orderType}
                            handleClick={option => {
                                dispatch(setOrderType(option as OrderType));
                                dispatch(resetUnitPrice());
                                trackButtonEvent(
                                    ButtonEvents.ORDER_TYPE,
                                    ButtonProperties.ORDER_TYPE,
                                    option
                                );
                            }}
                        />
                    )}
                    <div className='flex flex-col gap-3 laptop:gap-2'>
                        <div className='tablet:typography-desktop-body-4 typography-mobile-body-5 mx-2 flex flex-row justify-between'>
                            <span className='text-neutral-400'>{`${
                                isMobile ? 'Avl.' : 'Available'
                            } to ${
                                side === OrderSide.BORROW ? 'Borrow' : 'Lend'
                            }`}</span>
                            <span className='text-right text-primary-300'>
                                {`${ordinaryFormat(
                                    amountFormatterFromBase[currency](
                                        side === OrderSide.BORROW
                                            ? availableToBorrow
                                            : availableToLend
                                    ),
                                    0,
                                    2
                                )} ${isMobile ? '' : currency}`}
                            </span>
                        </div>
                        <OrderInputBox
                            field='Price'
                            disabled={isBondPriceFieldDisabled}
                            initialValue={
                                isMarketOrderType ? 'Market' : unitPriceValue
                            }
                            onValueChange={v => {
                                v !== undefined
                                    ? dispatch(setUnitPrice(v.toString()))
                                    : dispatch(setUnitPrice(''));
                                track(InteractionEvents.BOND_PRICE, {
                                    [InteractionProperties.BOND_PRICE]:
                                        v?.toString(),
                                });
                            }}
                            informationText='Input value greater than or equal to 0.01 and up to and including 100.'
                            decimalPlacesAllowed={2}
                            maxLimit={100}
                            bgClassName={
                                isBondPriceFieldDisabled
                                    ? 'bg-neutral-700'
                                    : undefined
                            }
                        >
                            {!isMarketOrderType && (
                                <button
                                    className='typography-desktop-body-4 font-semibold text-primary-500'
                                    disabled={!midPrice}
                                    onClick={() =>
                                        dispatch(
                                            setUnitPrice(midPrice?.toString())
                                        )
                                    }
                                >
                                    Mid
                                </button>
                            )}
                        </OrderInputBox>
                        <ErrorInfo
                            errorMessage='Invalid bond price'
                            showError={isInvalidBondPrice}
                        />
                        <OrderInputBox
                            field='Size'
                            unit={currency}
                            initialValue={
                                amountExists
                                    ? amountFormatterFromBase[currency](
                                          amount
                                      ).toString()
                                    : ''
                            }
                            onValueChange={v =>
                                handleInputChange((v as string) ?? '')
                            }
                            disabled={!isConnected}
                            bgClassName={
                                !isConnected ? 'bg-neutral-700' : undefined
                            }
                        />
                        <Slider
                            onChange={handleSliderChange}
                            value={sliderValue}
                            disabled={!isConnected}
                        />
                    </div>
                    <div className='mb-2.5 flex flex-col gap-1 laptop:mb-0'>
                        <OrderDisplayBox
                            field='Est. APR'
                            value={formatLoanValue(loanValue, 'rate')}
                        />
                        <OrderDisplayBox
                            field={isMobile ? 'PV' : 'Present Value'}
                            value={
                                isMobile
                                    ? `${ordinaryFormat(
                                          orderAmount?.value ?? 0,
                                          0,
                                          currencyMap[currency].roundingDecimal
                                      )} ${currency}`
                                    : `${ordinaryFormat(
                                          orderAmount?.value ?? 0,
                                          0,
                                          currencyMap[currency].roundingDecimal
                                      )} ${currency} (${usdFormat(
                                          orderAmount?.toUSD(price) ?? 0,
                                          2
                                      )})`
                            }
                        />
                        <OrderDisplayBox
                            field={isMobile ? 'FV' : 'Future Value'}
                            value={
                                unitPriceValue &&
                                unitPriceValue !== '' &&
                                unitPriceValue !== '0'
                                    ? (() => {
                                          const fv = calculateFutureValue(
                                              amount,
                                              Number(unitPriceValue)
                                          );
                                          const totalValue = price
                                              ? fv * price
                                              : 0;
                                          return isMobile
                                              ? `${ordinaryFormat(
                                                    fv,
                                                    0,
                                                    currencyMap[currency]
                                                        .roundingDecimal
                                                )} ${currency}`
                                              : `${ordinaryFormat(
                                                    fv,
                                                    0,
                                                    currencyMap[currency]
                                                        .roundingDecimal
                                                )} ${currency} (${usdFormat(
                                                    totalValue,
                                                    2
                                                )})`;
                                      })()
                                    : isMobile
                                    ? `0 ${currency}`
                                    : `0 ${currency} ($0.00)`
                            }
                        />
                    </div>
                    <OrderAction
                        loanValue={loanValue}
                        collateralBook={collateralBook}
                        validation={shouldDisableActionButton}
                        isCurrencyDelisted={delistedCurrencySet.has(currency)}
                        canPlaceOrder={canPlaceOrder}
                    />
                    <ErrorInfo
                        errorMessage='Simultaneous borrow and lend orders are not allowed during the pre-open market period.'
                        align='left'
                        showError={showPreOrderError}
                    />
                    <div className='flex flex-col gap-1 py-1'>
                        <OrderDisplayBox
                            field='Required Collateral'
                            value={'--'}
                        />
                        <OrderDisplayBox
                            field='Fees'
                            value={calculateFee(maturity, orderFee)}
                            informationText='A duration-based transaction fee only for market takers,
                                    factored into the bond price, and deducted from its future value'
                        />
                    </div>
                </div>
                <div className='col-span-5 laptop:hidden'>
                    {isTablet && (
                        <NewOrderBookWidget
                            orderbook={orderBook}
                            currency={currency}
                            marketPrice={currentMarket?.value}
                            maxLendUnitPrice={market?.maxLendUnitPrice}
                            minBorrowUnitPrice={market?.minBorrowUnitPrice}
                            onFilterChange={handleFilterChange}
                            onAggregationChange={setMultiplier}
                            rowsToRenderMobile={18}
                            isItayose
                        />
                    )}
                </div>
            </div>
            <section className='px-4'>
                <div className='border-neutral-3 laptop:border-t laptop:pt-4'>
                    <CollateralManagementConciseTab
                        collateralCoverage={collateralUsagePercent}
                        availableToBorrow={collateralBook.usdAvailableToBorrow}
                        collateralThreshold={collateralBook.collateralThreshold}
                        account={address}
                        totalCollateralInUSD={totalCollateralInUSD}
                    />
                </div>
            </section>
        </div>
    );
}
