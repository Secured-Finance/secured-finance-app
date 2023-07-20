import { Disclosure, Transition } from '@headlessui/react';
import { OrderSide } from '@secured-finance/sf-client';
import { formatDate } from '@secured-finance/sf-core';
import {
    ExpandIndicator,
    InformationPopover,
    Section,
    SectionWithItems,
} from 'src/components/atoms';
import {
    AmountCard,
    CollateralSimulationSection,
} from 'src/components/molecules';
import { CollateralBook, useOrderFee } from 'src/hooks';
import { calculateFee, prefixTilde } from 'src/utils';
import { Amount, LoanValue, Maturity } from 'src/utils/entities';

const FeeItem = () => {
    return (
        <div className='flex flex-row items-center gap-1'>
            <div className='text-planetaryPurple'>Transaction Fee %</div>
            <InformationPopover>
                A duration-based transaction fee only for market takers,
                factored into the bond price, and deducted from its future value
            </InformationPopover>
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
    const orderFee = useOrderFee(amount.currency);

    return (
        <div className='grid w-full grid-cols-1 justify-items-stretch gap-6 text-white'>
            <Section>
                <AmountCard amount={amount} price={assetPrice} />
            </Section>
            <CollateralSimulationSection
                collateral={collateral}
                tradeAmount={amount}
                side={side}
                assetPrice={assetPrice}
                tradeValue={loanValue}
            />
            <SectionWithItems
                itemList={[
                    ['Maturity Date', formatDate(maturity.toNumber())],
                    [
                        FeeItem(),
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
                                className='flex h-6 w-full flex-row items-center justify-between'
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
                                <Disclosure.Panel>
                                    <div className='typography-caption pt-3 text-secondary7'>
                                        Circuit breaker will be triggered if the
                                        order is filled at over the max slippage
                                        level at 1 block.
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
