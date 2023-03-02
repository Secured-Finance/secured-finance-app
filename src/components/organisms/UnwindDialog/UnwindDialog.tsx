import { Disclosure } from '@headlessui/react';
import { useSelector } from 'react-redux';
import {
    ExpandIndicator,
    Section,
    SectionWithItems,
} from 'src/components/atoms';
import { AmountCard, Dialog, DialogState } from 'src/components/molecules';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { Amount, Maturity } from 'src/utils/entities';

export const UnwindDialog = ({
    isOpen,
    onClose,
    amount,
    maturity,
}: {
    amount: Amount | undefined;
    maturity: Maturity | undefined;
} & DialogState) => {
    if (!amount || !maturity) return null;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const price = priceList[amount.currency];

    return (
        <Dialog
            title='Unwind Position'
            description={maturity.toString()}
            callToAction='Unwind Position'
            onClose={onClose}
            isOpen={isOpen}
            onClick={() => {}}
        >
            <div className='grid w-full grid-cols-1 justify-items-stretch gap-6 text-white'>
                <Section>
                    <AmountCard
                        ccy={amount.currency}
                        amount={amount.value}
                        price={price}
                    />
                </Section>
                <SectionWithItems
                    itemList={[
                        ['Borrow Remaining', '151 / 162'],
                        ['Collateral Usage', '45 -> 12'],
                    ]}
                />
                <Disclosure>
                    {({ open }) => (
                        <>
                            <Disclosure.Button className='flex h-6 flex-row items-center justify-between'>
                                <h2 className='typography-hairline-2 text-neutral-8'>
                                    Additional Information
                                </h2>
                                <ExpandIndicator expanded={open} />
                            </Disclosure.Button>
                            <Disclosure.Panel>
                                <SectionWithItems
                                    itemList={[
                                        ['Contract Borrowed Amount', '0.1 ETH'],
                                        ['Collateralization Ratio', '150%'],
                                        ['Liquidation Price', '0.1 ETH'],
                                    ]}
                                />
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
            </div>
        </Dialog>
    );
};
