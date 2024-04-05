import { track } from '@amplitude/analytics-browser';
import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    CollateralManagementConciseTab,
    ErrorInfo,
    OrderDisplayBox,
    OrderInputBox,
    RadioGroupSelector,
    Slider,
    WalletSourceSelector,
} from 'src/components/atoms';
import { NewOrderBookWidget, OrderAction } from 'src/components/organisms';
import {
    CollateralBook,
    useBalances,
    useBorrowableAmount,
    useBreakpoint,
    useLastPrices,
    useMarket,
} from 'src/hooks';
import { useOrderbook } from 'src/hooks/useOrderbook';
import {
    resetUnitPrice,
    selectLandingOrderForm,
    selectLandingOrderInputs,
    setAmount,
    setOrderType,
    setSide,
    setSourceAccount,
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
    divide,
    formatLoanValue,
    generateWalletSourceInformation,
    getAmountValidation,
    ordinaryFormat,
    prefixTilde,
    usdFormat,
} from 'src/utils';
import { AMOUNT_PRECISION, Amount, LoanValue } from 'src/utils/entities';
import {
    InteractionEvents,
    InteractionProperties,
    trackButtonEvent,
} from 'src/utils/events';
import { useAccount } from 'wagmi';

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
    } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

    const [orderBook, setMultiplier, setIsShowingAll] = useOrderbook(
        currency,
        maturity
    );

    const { address, isConnected } = useAccount();
    const { amountInput, unitPriceInput } = useSelector((state: RootState) =>
        selectLandingOrderInputs(state.landingOrderForm)
    );

    const [sliderValue, setSliderValue] = useState(0.0);

    const balanceRecord = useBalances();
    const isTablet = useBreakpoint('laptop');

    const loanValue = useMemo(() => {
        if (!maturity) return LoanValue.ZERO;
        if (unitPrice !== undefined) {
            return LoanValue.fromPrice(
                Number(unitPrice),
                maturity,
                calculationDate
            );
        }
        if (!marketPrice) return LoanValue.ZERO;
        return LoanValue.fromPrice(marketPrice, maturity, calculationDate);
    }, [maturity, unitPrice, marketPrice, calculationDate]);

    const unitPriceValue = useMemo(() => {
        if (!maturity) return undefined;
        if (unitPriceInput !== undefined) {
            return unitPriceInput;
        }
        if (!marketPrice) return undefined;
        if (!isConnected) return undefined;
        return (marketPrice / 100.0).toString();
    }, [maturity, marketPrice, unitPriceInput, isConnected]);

    const dispatch = useDispatch();

    const collateralUsagePercent = useMemo(() => {
        return collateralBook.coverage / 100.0;
    }, [collateralBook]);

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

    const slippage = useMemo(() => {
        if (!market) {
            return 0;
        }

        return side === OrderSide.BORROW
            ? market.minBorrowUnitPrice
            : market.maxLendUnitPrice;
    }, [market, side]);

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

    const handleSliderChange = (percentage: number) => {
        const available =
            side === OrderSide.BORROW ? availableToBorrow : balanceToLend;
        track(InteractionEvents.SLIDER, {
            [InteractionProperties.SLIDER_VALUE]: percentage,
        });
        dispatch(
            setAmount(
                (
                    Math.floor(percentage * available * AMOUNT_PRECISION) /
                    (100.0 * AMOUNT_PRECISION)
                ).toString()
            )
        );
        setSliderValue(percentage);
    };

    const handleInputChange = (v: string) => {
        dispatch(setAmount(v));
        const available =
            side === OrderSide.BORROW ? availableToBorrow : balanceToLend;
        const inputValue = Number(v);
        available > 0
            ? setSliderValue(Math.min(100.0, (inputValue * 100.0) / available))
            : setSliderValue(0.0);
    };

    useEffect(() => {
        if (isItayose) {
            dispatch(setOrderType(OrderType.LIMIT));
        }
    }, [dispatch, isItayose]);

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
                ? available
                : amountFormatterFromBase[currency](amount);

        dispatch(setAmount(inputAmount.toString()));
        available
            ? setSliderValue(Math.min(100.0, (inputAmount * 100.0) / available))
            : setSliderValue(0.0);
    };

    const isInvalidBondPrice = unitPrice === 0 && orderType === OrderType.LIMIT;

    const showPreOrderError =
        isItayose &&
        ((preOrderPosition === 'borrow' && side === OrderSide.LEND) ||
            (preOrderPosition === 'lend' && side === OrderSide.BORROW));

    const shouldDisableActionButton =
        getAmountValidation(
            amountFormatterFromBase[currency](amount),
            balanceToLend,
            side
        ) ||
        isInvalidBondPrice ||
        showPreOrderError;

    const isMarketOrderType = orderType === OrderType.MARKET;

    const isBondPriceFieldDisabled = isMarketOrderType || !isConnected;

    // TODO: handle height of orderbook based off of OrderSideMap[side], orderType values

    return (
        <div className='h-full rounded-b-xl border-white-10 pb-7 laptop:border laptop:bg-cardBackground laptop:bg-opacity-60'>
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
                    trackButtonEvent(
                        ButtonEvents.ORDER_SIDE,
                        ButtonProperties.ORDER_SIDE,
                        option
                    );
                }}
                variant='NavTab'
                optionsStyles={[
                    {
                        bgColorActive: 'bg-nebulaTeal',
                        textClassActive: 'text-secondary3 font-semibold',
                        gradient: {
                            from: 'from-tabGradient-4',
                            to: 'to-tabGradient-3',
                        },
                    },
                    {
                        bgColorActive: 'bg-galacticOrange',
                        textClassActive: 'text-[#FFE5E8] font-semibold',
                        gradient: {
                            from: 'from-tabGradient-6',
                            to: 'to-tabGradient-5',
                        },
                    },
                ]}
            />

            <div className='grid w-full grid-cols-12 gap-5 px-4 pb-8 pt-4 laptop:pb-4 laptop:pt-5'>
                <div className='col-span-7 flex flex-col justify-start gap-2 laptop:col-span-12 laptop:gap-4'>
                    {!isItayose && (
                        <div className='mb-1 laptop:mb-0'>
                            <RadioGroupSelector
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
                                variant='StyledButton'
                            />
                        </div>
                    )}
                    {side === OrderSide.LEND && (
                        <div className='space-y-1'>
                            <div className='mb-1 laptop:mb-0'>
                                <WalletSourceSelector
                                    optionList={walletSourceList}
                                    selected={selectedWalletSource}
                                    account={address ?? ''}
                                    onChange={handleWalletSourceChange}
                                />
                            </div>
                            <ErrorInfo
                                showError={getAmountValidation(
                                    amountFormatterFromBase[currency](amount),
                                    balanceToLend,
                                    side
                                )}
                                errorMessage='Insufficient amount in source'
                            />
                        </div>
                    )}
                    <div className='flex flex-col gap-3 laptop:gap-2.5'>
                        <OrderInputBox
                            field='Bond Price'
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
                        />
                        <ErrorInfo
                            errorMessage='Invalid bond price'
                            showError={isInvalidBondPrice}
                        />
                        {isMarketOrderType && (
                            <div className='mx-2 laptop:mx-10px'>
                                <OrderDisplayBox
                                    field='Max Slippage'
                                    value={divide(slippage, 100)}
                                    informationText='A bond price limit, triggering a circuit breaker if exceeded within a single block due to price fluctuations.'
                                />
                            </div>
                        )}
                        <div className='mx-2 mb-1 laptop:mx-10px laptop:mb-0'>
                            <OrderDisplayBox
                                field='Fixed Rate (APR)'
                                value={formatLoanValue(loanValue, 'rate')}
                            />
                        </div>
                    </div>
                    {side === OrderSide.BORROW && (
                        <div className='laptop:typography-caption mx-2 flex flex-row justify-between text-[11px] laptop:mx-10px'>
                            <div className='text-slateGray'>{`Available To Borrow (${currency.toString()})`}</div>
                            <div className='text-right text-planetaryPurple'>
                                {prefixTilde(
                                    ordinaryFormat(availableToBorrow, 0, 6)
                                )}
                            </div>
                        </div>
                    )}
                    <OrderInputBox
                        field='Amount'
                        unit={currency}
                        initialValue={amountInput}
                        onValueChange={v =>
                            handleInputChange((v as string) ?? '')
                        }
                        disabled={!isConnected}
                        bgClassName={
                            !isConnected ? 'bg-neutral-700' : undefined
                        }
                    />
                    <div className='mx-10px'>
                        <Slider
                            onChange={handleSliderChange}
                            value={sliderValue}
                            disabled={!isConnected}
                        />
                    </div>
                    <div className='mx-2 flex flex-col gap-2 laptop:mx-10px'>
                        <OrderDisplayBox
                            field='Est. Present Value'
                            value={usdFormat(orderAmount?.toUSD(price) ?? 0, 2)}
                        />
                        <OrderDisplayBox
                            field='Future Value'
                            value='--' // todo after apy -> apr
                            informationText='Future Value is the expected return value of the contract at time of maturity.'
                        />
                    </div>

                    <div className=''>
                        <OrderAction
                            loanValue={loanValue}
                            collateralBook={collateralBook}
                            validation={shouldDisableActionButton}
                            isCurrencyDelisted={delistedCurrencySet.has(
                                currency
                            )}
                        />
                    </div>

                    <ErrorInfo
                        errorMessage='Simultaneous borrow and lend orders are not allowed during the pre-open market period.'
                        align='left'
                        showError={showPreOrderError}
                    />
                </div>
                <div className='col-span-5 laptop:hidden'>
                    {isTablet && (
                        <NewOrderBookWidget
                            orderbook={orderBook}
                            currency={currency}
                            marketPrice={currentMarket?.value}
                            onFilterChange={state =>
                                setIsShowingAll(
                                    state.showBorrow && state.showLend
                                )
                            }
                            onAggregationChange={setMultiplier}
                            rowsToRenderMobile={18}
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
                    />
                </div>
            </section>
        </div>
    );
}
