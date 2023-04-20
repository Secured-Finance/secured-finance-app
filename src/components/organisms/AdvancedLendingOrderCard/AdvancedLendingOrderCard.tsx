import { RadioGroup } from '@headlessui/react';
import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import classNames from 'classnames';
import { BigNumber } from 'ethers';
import Link from 'next/link';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    BorrowLendSelector,
    CollateralManagementConciseTab,
    NavTab,
    OrderDisplayBox,
    OrderInputBox,
    Separator,
    Slider,
    WalletSourceSelector,
} from 'src/components/atoms';
import { OrderAction } from 'src/components/organisms';
import { CollateralBook } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import {
    selectLandingOrderForm,
    setAmount,
    setOrderType,
    setSide,
    setSourceAccount,
    setUnitPrice,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { selectAllBalances } from 'src/store/wallet';
import { OrderType } from 'src/types';
import {
    MAX_COVERAGE,
    amountFormatterToBase,
    computeAvailableToBorrow,
    divide,
    generateWalletSourceInformation,
    multiply,
    percentFormat,
    usdFormat,
} from 'src/utils';
import { Amount, LoanValue } from 'src/utils/entities';
import { useWallet } from 'use-wallet';

export const AdvancedLendingOrderCard = ({
    collateralBook,
    onlyLimitOrder = false,
}: {
    collateralBook: CollateralBook;
    onlyLimitOrder?: boolean;
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

    const balanceRecord = useSelector((state: RootState) =>
        selectAllBalances(state)
    );

    const loanValue = useMemo(() => {
        if (unitPrice && maturity) {
            return LoanValue.fromPrice(unitPrice, maturity.toNumber());
        }

        return LoanValue.ZERO;
    }, [unitPrice, maturity]);

    const dispatch = useDispatch();
    const { account } = useWallet();

    const collateralUsagePercent = useMemo(() => {
        return collateralBook.coverage.toNumber() / 100.0;
    }, [collateralBook]);

    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const assetPriceMap = useSelector((state: RootState) => getPriceMap(state));

    const price = priceList[currency];

    const orderAmount = new Amount(amount, currency);

    const availableToBorrow = useMemo(() => {
        return currency && assetPriceMap
            ? computeAvailableToBorrow(
                  assetPriceMap[currency],
                  collateralBook.usdCollateral,
                  collateralBook.coverage.toNumber() / MAX_COVERAGE
              )
            : 0;
    }, [assetPriceMap, collateralBook, currency]);

    const walletSourceList = useMemo(() => {
        return generateWalletSourceInformation(
            currency,
            balanceRecord[currency],
            collateralBook.nonCollateral[currency] ?? BigNumber.from(0)
        );
    }, [balanceRecord, collateralBook.nonCollateral, currency]);

    const selectedWalletSource = useMemo(() => {
        return (
            walletSourceList.find(w => w.source === sourceAccount) ||
            walletSourceList[0]
        );
    }, [sourceAccount, walletSourceList]);

    const handleAmountChange = (percentage: number) => {
        const available =
            side === OrderSide.BORROW
                ? availableToBorrow
                : balanceRecord[currency];
        dispatch(
            setAmount(
                amountFormatterToBase[currency](
                    Math.floor(percentage * available) / 100.0
                )
            )
        );
    };

    return (
        <div className='h-fit rounded-b-xl border border-white-10 bg-cardBackground bg-opacity-60 pb-7 shadow-tab'>
            <RadioGroup
                value={orderType}
                onChange={(v: OrderType) => {
                    dispatch(setOrderType(v));
                }}
                as='div'
                className='flex h-[60px] flex-row items-center justify-around'
            >
                <RadioGroup.Option
                    value={OrderType.MARKET}
                    className={classNames('h-full w-1/2', {
                        hidden: onlyLimitOrder,
                    })}
                    as='button'
                >
                    {({ checked }) => (
                        <NavTab text={OrderType.MARKET} active={checked} />
                    )}
                </RadioGroup.Option>
                <RadioGroup.Option
                    value={OrderType.LIMIT}
                    as='button'
                    className={classNames('h-full', {
                        'w-full': onlyLimitOrder,
                        'w-1/2': !onlyLimitOrder,
                    })}
                >
                    {({ checked }) => (
                        <NavTab text={OrderType.LIMIT} active={checked} />
                    )}
                </RadioGroup.Option>
            </RadioGroup>

            <div className='flex w-full flex-col justify-center gap-6 px-4 pt-5'>
                <BorrowLendSelector
                    handleClick={side => {
                        dispatch(setSide(side));
                        dispatch(setSourceAccount(WalletSource.METAMASK));
                    }}
                    side={side}
                    variant='advanced'
                />
                {account && side === OrderSide.LEND && (
                    <WalletSourceSelector
                        optionList={walletSourceList}
                        selected={selectedWalletSource}
                        account={account ?? ''}
                        onChange={v => dispatch(setSourceAccount(v))}
                    />
                )}
                <div className='flex flex-col gap-[10px]'>
                    <OrderInputBox
                        field='Bond Price'
                        disabled={orderType === OrderType.MARKET}
                        initialValue={divide(unitPrice, 100)}
                        onValueChange={v =>
                            dispatch(setUnitPrice(multiply(v as number, 100)))
                        }
                        informationText='Input value from 0 to 100'
                        decimalPlacesAllowed={2}
                        maxLimit={100}
                    />
                    <div className='mx-10px'>
                        <OrderDisplayBox
                            field='Fixed Rate (APR)'
                            value={percentFormat(
                                LoanValue.fromPrice(
                                    unitPrice,
                                    maturity.toNumber()
                                ).apr.toNormalizedNumber()
                            )}
                        />
                    </div>
                </div>
                <Slider onChange={handleAmountChange} />
                <OrderInputBox
                    field='Amount'
                    unit={currency}
                    asset={currency}
                    initialValue={orderAmount.value}
                    onValueChange={v => dispatch(setAmount(v as BigNumber))}
                />
                <div className='mx-10px flex flex-col gap-6'>
                    <OrderDisplayBox
                        field='Est. Present Value'
                        value={usdFormat(orderAmount.toUSD(price), 2)}
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
                />
            </div>
        </div>
    );
};
