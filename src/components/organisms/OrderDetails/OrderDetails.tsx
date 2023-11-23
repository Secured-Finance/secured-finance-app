import { Disclosure, Transition } from '@headlessui/react';
import { OrderSide } from '@secured-finance/sf-client';
import { formatDate } from '@secured-finance/sf-core';
import { useMemo } from 'react';
import {
    ExpandIndicator,
    Section,
    SectionWithItems,
    TextLink,
} from 'src/components/atoms';
import {
    AmountCard,
    CollateralSimulationSection,
    DelistedCurrencyDisclaimer,
} from 'src/components/molecules';
import { Tooltip } from 'src/components/templates';
import { CollateralBook, useMarket, useOrderFee } from 'src/hooks';
import {
    calculateFee,
    divide,
    formatLoanValue,
    formatWithCurrency,
    prefixTilde,
} from 'src/utils';
import { Amount, LoanValue, Maturity } from 'src/utils/entities';

const FeeItem = () => {
    return (
        <div className='flex flex-row items-center gap-1'>
            <div className='text-planetaryPurple'>Transaction Fee %</div>
            <Tooltip>
                A duration-based transaction fee only for market takers,
                factored into the bond price, and deducted from its future value
            </Tooltip>
        </div>
    );
};

export const OrderDetails = ({
    amount,
    maturity,
    side,
    assetPrice,
    collateral,
    loanValue,
    showWarning,
    isCurrencyDelisted,
    isRemoveOrder = false,
}: {
    amount: Amount;
    maturity: Maturity;
    side: OrderSide;
    assetPrice: number;
    collateral: CollateralBook;
    loanValue: LoanValue;
    showWarning?: boolean;
    isCurrencyDelisted?: boolean;
    isRemoveOrder?: boolean;
}) => {
    const { data: orderFee = 0 } = useOrderFee(amount.currency);

    const market = useMarket(amount.currency, maturity.toNumber());

    const slippage = useMemo(() => {
        if (!market) {
            return 0;
        }

        return side === OrderSide.BORROW
            ? market.minBorrowUnitPrice
            : market.maxLendUnitPrice;
    }, [market, side]);

    const amountCard = <AmountCard amount={amount} price={assetPrice} />;

    return (
        <div className='grid w-full grid-cols-1 justify-items-stretch gap-6 text-white'>
            {isCurrencyDelisted && (
                <DelistedCurrencyDisclaimer
                    currencies={new Set([amount.currency])}
                />
            )}
            {!isCurrencyDelisted && showWarning && market && (
                <Section variant='warning'>
                    <p>
                        Warning: Your order price is currently lower than
                        minimum collateral base price of{' '}
                        <span className='font-bold'>
                            {formatLoanValue(
                                LoanValue.fromPrice(
                                    market.currentMinDebtUnitPrice,
                                    market.maturity
                                ),
                                'price'
                            )}
                        </span>
                        . Your adjusted PV will be{' '}
                        <span>
                            {formatWithCurrency(amount.value, amount.currency)}
                        </span>
                        . To place the order you need to deposit sufficient
                        collateral.{' '}
                        <TextLink
                            href='https://docs.secured.finance/technical-overview/risk-management/minimum-collateral'
                            text='Learn More'
                        />
                    </p>
                </Section>
            )}
            <SectionWithItems
                header={amountCard}
                itemList={[
                    [
                        'Bond Price',
                        prefixTilde(
                            formatLoanValue(
                                loanValue ?? LoanValue.ZERO,
                                'price'
                            )
                        ),
                    ],
                    [
                        'APR',
                        prefixTilde(
                            formatLoanValue(loanValue ?? LoanValue.ZERO, 'rate')
                        ),
                    ],
                    ['Maturity Date', formatDate(maturity.toNumber())],
                ]}
            />
            {!isRemoveOrder && (
                <>
                    <CollateralSimulationSection
                        collateral={collateral}
                        maturity={maturity}
                        tradeAmount={amount}
                    />
                    <SectionWithItems
                        itemList={[
                            [
                                <FeeItem key={maturity.toString()} />,
                                prefixTilde(
                                    calculateFee(maturity.toNumber(), orderFee)
                                ),
                            ],
                        ]}
                    />
                    <Disclosure>
                        {({ open }) => (
                            <>
                                <div className='relative'>
                                    <Disclosure.Button
                                        className='flex h-6 w-full flex-row items-center justify-between focus:outline-none'
                                        data-testid='disclaimer-button'
                                    >
                                        <h2 className='typography-hairline-2 text-neutral-8'>
                                            Circuit Breaker Disclaimer
                                        </h2>
                                        <ExpandIndicator expanded={open} />
                                    </Disclosure.Button>
                                    <Transition
                                        show={open}
                                        enter='transition duration-100 ease-out'
                                        enterFrom='transform scale-95 opacity-0'
                                        enterTo='transform scale-100 opacity-100'
                                    >
                                        <Disclosure.Panel data-testid='disclaimer-text'>
                                            <div className='typography-caption pt-3 text-secondary7'>
                                                <span>
                                                    Circuit breaker will be
                                                    triggered if the order is
                                                    filled at over
                                                </span>
                                                <span className='font-semibold text-white'>
                                                    {` ${divide(
                                                        slippage,
                                                        100
                                                    )} `}
                                                </span>
                                                <span>
                                                    which is the max slippage
                                                    level at 1 block.
                                                </span>
                                            </div>
                                        </Disclosure.Panel>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Disclosure>
                </>
            )}
        </div>
    );
};
