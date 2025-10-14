import { Disclosure, Transition } from '@headlessui/react';
import { OrderSide } from '@secured-finance/sf-client';
import { useMemo } from 'react';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';
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
    InfoToolTip,
} from 'src/components/molecules';
import { CollateralBook, useMarket, useOrderFee } from 'src/hooks';
import { OrderType } from 'src/types';
import {
    FeeCalculator,
    divide,
    MaturityConverter,
    multiply,
    prefixTilde,
    formatter,
    calculate,
} from 'src/utils';
import { Amount, LoanValue, Maturity } from 'src/utils/entities';

const FeeItem = () => {
    return (
        <div className='flex flex-row items-center gap-1'>
            <div className='text-planetaryPurple'>Transaction Fee %</div>
            <InfoToolTip placement='bottom'>
                A duration-based transaction fee only for market takers,
                factored into the bond price, and deducted from its future value
            </InfoToolTip>
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
    showZCUsage = true,
    orderType,
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
    showZCUsage?: boolean;
    orderType?: OrderType;
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

    return (
        <div className='grid w-full grid-cols-1 justify-items-stretch gap-6 text-white'>
            {isCurrencyDelisted && (
                <DelistedCurrencyDisclaimer
                    currencies={new Set([amount.currency])}
                />
            )}
            {showWarning && market && (
                <Section variant='warning'>
                    <p className='typography-caption'>
                        Warning: Your order price is currently lower than
                        minimum collateral base price of{' '}
                        <span className='font-bold'>
                            {formatter.loanValue('price')(
                                calculate.loanValueFromPrice(
                                    market.currentMinDebtUnitPrice,
                                    market.maturity
                                )
                            )}
                        </span>
                        . Your adjusted PV will be{' '}
                        <span>
                            {`${formatter.ordinary(
                                FINANCIAL_CONSTANTS.ZERO_DECIMALS,
                                FINANCIAL_CONSTANTS.PRICE_DECIMALS
                            )(
                                multiply(
                                    divide(
                                        amount.value,
                                        LoanValue.fromPrice(
                                            amount.value,
                                            market.maturity
                                        ).price
                                    ),
                                    market.currentMinDebtUnitPrice
                                )
                            )} ${amount.currency}`}
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
                header={<AmountCard amount={amount} price={assetPrice} />}
                itemList={[
                    [
                        'Bond Price',
                        orderType === OrderType.MARKET
                            ? 'Market'
                            : prefixTilde(
                                  formatter.loanValue('price')(
                                      loanValue ?? LoanValue.ZERO
                                  )
                              ),
                    ],
                    [
                        'APR',
                        prefixTilde(
                            formatter.loanValue('rate')(
                                loanValue ?? LoanValue.ZERO
                            )
                        ),
                    ],
                    ['Maturity Date', MaturityConverter.toDateString(maturity)],
                ]}
            />
            {!isRemoveOrder && (
                <>
                    <CollateralSimulationSection
                        collateral={collateral}
                        maturity={maturity}
                        tradeAmount={amount}
                        assetPrice={assetPrice}
                        side={side}
                        showZCUsage={showZCUsage}
                    />
                    <SectionWithItems
                        itemList={[
                            [
                                <FeeItem key={maturity.toString()} />,
                                prefixTilde(
                                    FeeCalculator.calculateTransactionFees(
                                        maturity,
                                        orderFee
                                    )
                                ),
                            ],
                        ]}
                    />
                    <Disclosure>
                        {({ open }) => (
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
                                                triggered if the order is filled
                                                at over
                                            </span>
                                            <span className='font-semibold text-white'>
                                                {` ${divide(
                                                    slippage,
                                                    FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR
                                                )} `}
                                            </span>
                                            <span>
                                                which is the max slippage level
                                                at 1 block.
                                            </span>
                                        </div>
                                    </Disclosure.Panel>
                                </Transition>
                            </div>
                        )}
                    </Disclosure>
                </>
            )}
        </div>
    );
};
