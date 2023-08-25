import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { BigNumber } from 'ethers';
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
import { OrderAction } from 'src/components/organisms';
import { CollateralBook, useSelectMarket } from 'src/hooks';
import { useBalances } from 'src/hooks/useERC20Balance';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import {
    resetUnitPrice,
    selectLandingOrderForm,
    setAmount,
    setOrderType,
    setSide,
    setSourceAccount,
    setUnitPrice,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { OrderSideMap, OrderType, OrderTypeOptions } from 'src/types';
import {
    MAX_COVERAGE,
    ZERO_BN,
    amountFormatterFromBase,
    amountFormatterToBase,
    computeAvailableToBorrow,
    divide,
    formatLoanValue,
    generateWalletSourceInformation,
    getAmountValidation,
    multiply,
    usdFormat,
} from 'src/utils';
import { Amount, LoanValue } from 'src/utils/entities';
import { useAccount } from 'wagmi';

export const AdvancedLendingOrderCard = ({
    collateralBook,
    onlyLimitOrder = false,
    marketPrice,
}: {
    collateralBook: CollateralBook;
    onlyLimitOrder?: boolean;
    marketPrice?: number;
}) => {
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
    const [sliderValue, setSliderValue] = useState(0.0);

    const balanceRecord = useBalances();

    const loanValue = useMemo(() => {
        if (!maturity) return LoanValue.ZERO;
        if (unitPrice !== undefined) {
            return LoanValue.fromPrice(unitPrice, maturity);
        }
        if (!marketPrice) return LoanValue.ZERO;
        return LoanValue.fromPrice(marketPrice, maturity);
    }, [unitPrice, maturity, marketPrice]);

    const dispatch = useDispatch();
    const { address } = useAccount();

    const collateralUsagePercent = useMemo(() => {
        return collateralBook.coverage.toNumber() / 100.0;
    }, [collateralBook]);

    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const price = priceList[currency];

    const market = useSelectMarket(currency, maturity);

    const slippage = useMemo(() => {
        if (!market) {
            return 0;
        }

        return side === OrderSide.BORROW
            ? market.minBorrowUnitPrice
            : market.maxLendUnitPrice;
    }, [market, side]);

    const orderAmount = amount.gt(ZERO_BN)
        ? new Amount(amount, currency)
        : undefined;

    const availableToBorrow = useMemo(() => {
        return currency && price
            ? computeAvailableToBorrow(
                  price,
                  collateralBook.usdCollateral,
                  collateralBook.coverage.toNumber() / MAX_COVERAGE,
                  collateralBook.collateralThreshold
              )
            : 0;
    }, [
        collateralBook.collateralThreshold,
        collateralBook.coverage,
        collateralBook.usdCollateral,
        currency,
        price,
    ]);

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
                      BigNumber.from(0)
              );
    }, [
        balanceRecord,
        collateralBook.nonCollateral,
        collateralBook.withdrawableCollateral,
        currency,
        selectedWalletSource.source,
    ]);

    const handleAmountChange = (percentage: number) => {
        const available =
            side === OrderSide.BORROW ? availableToBorrow : balanceToLend;
        dispatch(
            setAmount(
                amountFormatterToBase[currency](
                    Math.floor(percentage * available) / 100.0
                )
            )
        );
        setSliderValue(percentage);
    };

    const handleInputChange = (v: BigNumber) => {
        dispatch(setAmount(v));

        const available =
            side === OrderSide.BORROW ? availableToBorrow : balanceToLend;
        const inputValue = amountFormatterFromBase[currency](v);
        available > 0
            ? setSliderValue(Math.min(100.0, (inputValue * 100.0) / available))
            : setSliderValue(0.0);
    };
    useEffect(() => {
        if (onlyLimitOrder) {
            dispatch(setOrderType(OrderType.LIMIT));
        }
    }, [dispatch, onlyLimitOrder]);

    const handleWalletSourceChange = (source: WalletSource) => {
        dispatch(setSourceAccount(source));
        const available =
            source === WalletSource.METAMASK
                ? balanceRecord[currency]
                : amountFormatterFromBase[currency](
                      collateralBook.nonCollateral[currency] ||
                          collateralBook.withdrawableCollateral[currency] ||
                          BigNumber.from(0)
                  );
        const inputAmount = amount.gt(
            amountFormatterToBase[currency](available)
        )
            ? amountFormatterToBase[currency](available)
            : amount;
        dispatch(setAmount(inputAmount));
        available
            ? setSliderValue(
                  Math.min(
                      100.0,
                      (amountFormatterFromBase[currency](inputAmount) * 100.0) /
                          available
                  )
              )
            : setSliderValue(0.0);
    };

    const validateBondPrice = () => {
        return unitPrice === 0 && orderType === OrderType.LIMIT;
    };

    return (
        <div className='h-fit rounded-b-xl border border-white-10 bg-cardBackground bg-opacity-60 pb-7'>
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
                    dispatch(resetUnitPrice());
                }}
                variant='NavTab'
            />

            <div className='flex w-full flex-col justify-center gap-6 px-4 pt-5'>
                {!onlyLimitOrder && (
                    <RadioGroupSelector
                        options={OrderTypeOptions}
                        selectedOption={orderType}
                        handleClick={option => {
                            dispatch(setOrderType(option as OrderType));
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
                                amountFormatterFromBase[currency](amount),
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
                        initialValue={
                            loanValue.price > 0
                                ? divide(loanValue.price, 100)
                                : undefined
                        }
                        onValueChange={v => {
                            v !== undefined
                                ? dispatch(
                                      setUnitPrice(multiply(v as number, 100))
                                  )
                                : dispatch(setUnitPrice(0));
                        }}
                        informationText='Input value greater than or equal to 0.01 and up to and including 100.'
                        decimalPlacesAllowed={2}
                        maxLimit={100}
                    />
                    <ErrorInfo
                        errorMessage='Invalid bond price'
                        showError={validateBondPrice()}
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
                            value={formatLoanValue(loanValue, 'rate')}
                        />
                    </div>
                </div>
                <Slider onChange={handleAmountChange} value={sliderValue} />
                <OrderInputBox
                    field='Amount'
                    unit={currency}
                    asset={currency}
                    initialValue={orderAmount?.value}
                    onValueChange={v =>
                        handleInputChange(BigNumber.from(v ?? 0))
                    }
                />
                <div className='mx-10px flex flex-col gap-6'>
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

                <OrderAction
                    loanValue={loanValue}
                    collateralBook={collateralBook}
                    validation={
                        getAmountValidation(
                            amountFormatterFromBase[currency](amount),
                            balanceToLend,
                            side
                        ) ||
                        validateBondPrice() ||
                        (unitPrice === undefined &&
                            orderType === OrderType.LIMIT)
                    }
                />

                <Separator color='neutral-3'></Separator>

                <div className='typography-nav-menu-default flex flex-row justify-between'>
                    <div className='text-neutral-8'>Collateral Management</div>
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
                    totalCollateralInUSD={collateralBook.usdCollateral}
                    collateralThreshold={collateralBook.collateralThreshold}
                />
            </div>
        </div>
    );
};
