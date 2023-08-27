import { Disclosure, Transition } from '@headlessui/react';
import { OrderSide } from '@secured-finance/sf-client';
import { formatDate } from '@secured-finance/sf-core';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    ExpandIndicator,
    Section,
    SectionWithItems,
} from 'src/components/atoms';
import {
    AmountCard,
    CollateralSimulationSection,
} from 'src/components/molecules';
import { Tooltip } from 'src/components/templates';
import { CollateralBook, useOrderFee } from 'src/hooks';
import { selectMarket } from 'src/store/availableContracts';
import { RootState } from 'src/store/types';
import { calculateFee, divide, prefixTilde } from 'src/utils';
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
}: {
    amount: Amount;
    maturity: Maturity;
    side: OrderSide;
    assetPrice: number;
    collateral: CollateralBook;
    loanValue: LoanValue;
}) => {
    const { data: orderFee = 0 } = useOrderFee(amount.currency);

    const market = useSelector((state: RootState) =>
        selectMarket(amount.currency, maturity.toNumber())(state)
    );

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
            <Section>
                <AmountCard amount={amount} price={assetPrice} />
            </Section>
            <CollateralSimulationSection
                collateral={collateral}
                tradeAmount={amount}
                side={side}
                tradeValue={loanValue}
            />
            <SectionWithItems
                itemList={[
                    ['Maturity Date', formatDate(maturity.toNumber())],
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
                                            Circuit breaker will be triggered if
                                            the order is filled at over
                                        </span>
                                        <span className='font-semibold text-white'>
                                            {` ${divide(slippage, 100)} `}
                                        </span>
                                        <span>
                                            which is the max slippage level at 1
                                            block.
                                        </span>
                                    </div>
                                </Disclosure.Panel>
                            </Transition>
                        </div>
                    </>
                )}
            </Disclosure>
        </div>
    );
};
