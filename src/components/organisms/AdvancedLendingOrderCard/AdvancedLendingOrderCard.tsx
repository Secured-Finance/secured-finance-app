import { track } from '@amplitude/analytics-browser';
import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    CollateralManagementConciseTab,
    ErrorInfo,
    OrderDisplayBox,
    OrderInputBox,
    RadioGroupSelector,
    Separator,
    Slider,
    WalletSourceSelector,
} from 'src/components/atoms';
import { LineChartTab, OrderAction } from 'src/components/organisms';
import {
    CollateralBook,
    useBalances,
    useBorrowableAmount,
    useLastPrices,
    useMarket,
    useYieldCurveMarketRates,
} from 'src/hooks';
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

// TODO: reconcile location of imported OrderBook for mobile
import { YieldCurveDialog } from 'src/components/molecules/YieldCurveDialog';
import { useOrderbook } from 'src/hooks/useOrderbook';
import { CompactOrderBookWidget } from '../CompactOrderBookWidget';

// end of new imported OrderBook mobile hooks/methods

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

    const market = useMarket(currency, maturity);
    const marketUnitPrice = market?.marketUnitPrice;
    const openingUnitPrice = market?.openingUnitPrice;

    const currentMarket = useMemo(() => {
        if (marketUnitPrice) {
            return {
                value: LoanValue.fromPrice(marketUnitPrice, maturity),
                // TODO: get the time from the block
                time: 0,
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
    }, [marketUnitPrice, maturity, openingUnitPrice]);

    const [isShowYieldCurveDialog, setIsShowYieldCurveDialog] = useState(false);

    const {
        rates,
        maturityList,
        itayoseMarketIndexSet,
        maximumRate,
        marketCloseToMaturityOriginalRate,
    } = useYieldCurveMarketRates();

    const { address, isConnected } = useAccount();
    const { amountInput, unitPriceInput } = useSelector((state: RootState) =>
        selectLandingOrderInputs(state.landingOrderForm)
    );

    const [sliderValue, setSliderValue] = useState(0.0);

    const balanceRecord = useBalances();

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

    return (
        <>
            <YieldCurveDialog
                isOpen={isShowYieldCurveDialog}
                onClose={() => setIsShowYieldCurveDialog(false)}
            >
                <LineChartTab
                    rates={rates}
                    maturityList={maturityList}
                    itayoseMarketIndexSet={itayoseMarketIndexSet}
                    followLinks={false}
                    maximumRate={maximumRate}
                    marketCloseToMaturityOriginalRate={
                        marketCloseToMaturityOriginalRate
                    }
                />
            </YieldCurveDialog>
            <div className='h-full border border-b-0 border-t-0 border-white-10 bg-cardBackground bg-opacity-60 tablet:border-b tablet:border-t laptop:rounded-b-xl laptop:pb-7'>
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

                <div className='flex w-full flex-col justify-center gap-6 px-4 pt-4'>
                    <div className='grid grid-cols-12 gap-5'>
                        <div className='col-span-7 flex flex-col gap-6 tablet:justify-start laptop:col-span-12'>
                            {!isItayose && (
                                <RadioGroupSelector
                                    options={OrderTypeOptions}
                                    selectedOption={orderType}
                                    handleClick={option => {
                                        dispatch(
                                            setOrderType(option as OrderType)
                                        );
                                        dispatch(resetUnitPrice());
                                    }}
                                    variant='StyledButton'
                                />
                            )}
                            {side === OrderSide.LEND && (
                                <div className='space-y-1'>
                                    <WalletSourceSelector
                                        optionList={walletSourceList}
                                        selected={selectedWalletSource}
                                        account={address ?? ''}
                                        onChange={handleWalletSourceChange}
                                    />
                                    <ErrorInfo
                                        showError={getAmountValidation(
                                            amountFormatterFromBase[currency](
                                                amount
                                            ),
                                            balanceToLend,
                                            side
                                        )}
                                        errorMessage='Insufficient amount in source'
                                    />
                                </div>
                            )}
                            <div className='flex flex-col gap-10px'>
                                <OrderInputBox
                                    field='Bond Price'
                                    disabled={orderType === OrderType.MARKET}
                                    initialValue={unitPriceValue}
                                    onValueChange={v => {
                                        v !== undefined
                                            ? dispatch(
                                                  setUnitPrice(v.toString())
                                              )
                                            : dispatch(setUnitPrice(''));
                                    }}
                                    informationText='Input value greater than or equal to 0.01 and up to and including 100.'
                                    decimalPlacesAllowed={2}
                                    maxLimit={100}
                                />
                                <ErrorInfo
                                    errorMessage='Invalid bond price'
                                    showError={isInvalidBondPrice}
                                />
                                {orderType === OrderType.MARKET && (
                                    <div className='mx-10px'>
                                        <OrderDisplayBox
                                            field='Max Slippage'
                                            value={divide(slippage, 100)}
                                            informationText='A bond price limit, triggering a circuit breaker if exceeded within a single block due to price fluctuations.'
                                        />
                                    </div>
                                )}
                                <div className='mx-10px'>
                                    <OrderDisplayBox
                                        field='Fixed Rate (APR)'
                                        value={formatLoanValue(
                                            loanValue,
                                            'rate'
                                        )}
                                    />
                                </div>
                            </div>
                            {/* <div className='mx-10px'>
                                <Slider
                                    onChange={handleAmountChange}
                                    value={sliderValue}
                                />
                            </div> */}
                            {side === OrderSide.BORROW && (
                                <div className='typography-caption mx-10px flex flex-row justify-between'>
                                    <div className='text-slateGray'>{`Available To Borrow (${currency.toString()})`}</div>
                                    <div className='text-right text-planetaryPurple'>
                                        {prefixTilde(
                                            ordinaryFormat(availableToBorrow)
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
                            />
                            <div className='mx-10px flex flex-col gap-6'>
                                <OrderDisplayBox
                                    field='Est. Present Value'
                                    value={usdFormat(
                                        orderAmount?.toUSD(price) ?? 0,
                                        2
                                    )}
                                />
                                <OrderDisplayBox
                                    field='Future Value'
                                    value='--' // todo after apy -> apr
                                    informationText='Future Value is the expected return value of the contract at time of maturity.'
                                />
                            </div>

                            <OrderAction
                                loanValue={loanValue}
                                collateralBook={collateralBook}
                                validation={shouldDisableActionButton}
                                isCurrencyDelisted={delistedCurrencySet.has(
                                    currency
                                )}
                            />
                        </div>
                        <div className='col-span-5 block laptop:hidden'>
                            <div
                                className='mb-3 flex h-[100px] flex-col'
                                onClick={() =>
                                    setIsShowYieldCurveDialog(
                                        !isShowYieldCurveDialog
                                    )
                                }
                                onKeyDown={() =>
                                    setIsShowYieldCurveDialog(
                                        !isShowYieldCurveDialog
                                    )
                                }
                                role='button'
                                tabIndex={0}
                            >
                                <LineChartTab
                                    rates={rates}
                                    maturityList={maturityList.map(item => ({
                                        ...item,
                                        label: '',
                                    }))}
                                    itayoseMarketIndexSet={
                                        itayoseMarketIndexSet
                                    }
                                    followLinks={false}
                                    maximumRate={maximumRate}
                                    marketCloseToMaturityOriginalRate={
                                        marketCloseToMaturityOriginalRate
                                    }
                                />
                            </div>
                            <CompactOrderBookWidget
                                orderbook={orderBook}
                                marketPrice={currentMarket?.value}
                                isCurrencyDelisted={delistedCurrencySet.has(
                                    currency
                                )}
                                currency={currency}
                                onFilterChange={state =>
                                    setIsShowingAll(
                                        state.showBorrow && state.showLend
                                    )
                                }
                                onAggregationChange={setMultiplier}
                            />
                        </div>
                    </div>

                    <ErrorInfo
                        errorMessage='Simultaneous borrow and lend orders are not allowed during the pre-open market period.'
                        align='left'
                        showError={showPreOrderError}
                    />
                    <ErrorInfo
                        errorMessage='Invalid bond price'
                        showError={isInvalidBondPrice}
                    />
                    {isMarketOrderType && (
                        <div className='mx-10px'>
                            <OrderDisplayBox
                                field='Max Slippage'
                                value={divide(slippage, 100)}
                                informationText='A bond price limit, triggering a circuit breaker if exceeded within a single block due to price fluctuations.'
                            />
                        </div>
                    )}
                    <div className='mx-10px'>
                        <OrderDisplayBox
                            field='Fixed Rate (APR)'
                            value={formatLoanValue(loanValue, 'rate')}
                        />
                    </div>
                </div>
                {side === OrderSide.BORROW && (
                    <div className='typography-caption mx-10px flex flex-row justify-between'>
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
                    onValueChange={v => handleInputChange((v as string) ?? '')}
                    disabled={!isConnected}
                    bgClassName={!isConnected ? 'bg-neutral-700' : undefined}
                />
                <div className='mx-10px'>
                    <Slider
                        onChange={handleSliderChange}
                        value={sliderValue}
                        disabled={!isConnected}
                    />
                </div>
                <div className='mx-10px flex flex-col gap-2'>
                    <OrderDisplayBox
                        field='Est. Present Value'
                        value={usdFormat(orderAmount?.toUSD(price) ?? 0, 2)}
                    />
                    <OrderDisplayBox
                        field='Future Value'
                        value='--' // todo after apy -> apr
                        informationText='Future Value is the expected return value of the contract at time of maturity.'
                    />

                    <div className='hidden tablet:block'>
                        <Separator color='neutral-3'></Separator>
                    </div>

                    <div className='typography-nav-menu-default hidden flex-row justify-between laptop:flex'>
                        <div className='text-neutral-8'>
                            Collateral Management
                        </div>
                        <Link href='/portfolio' passHref>
                            <a
                                className='text-planetaryPurple'
                                href='_'
                                role='button'
                            >
                                {'Manage \u00BB'}
                            </a>
                        </Link>
                    </div>

                    <CollateralManagementConciseTab
                        collateralCoverage={collateralUsagePercent}
                        availableToBorrow={collateralBook.usdAvailableToBorrow}
                        collateralThreshold={collateralBook.collateralThreshold}
                        account={address}
                    />
                </div>
            </div>
        </>
    );
}
