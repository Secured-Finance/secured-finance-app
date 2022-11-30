import { Disclosure } from '@headlessui/react';
import React from 'react';
import { ExpandIndicator, HorizontalListItem } from 'src/components/atoms';
import { AmountCard, Dialog } from 'src/components/molecules';
import { CurrencySymbol } from 'src/utils';

const Section = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='rounded-xl border border-neutral-3'>
            <div className='py-4 px-6'>{children}</div>
        </div>
    );
};

const SectionWithItems = ({ itemList }: { itemList: [string, string][] }) => {
    return (
        <Section>
            <div className='grid grid-cols-1 gap-2'>
                {itemList.map(([label, value]) => (
                    <HorizontalListItem
                        key={label}
                        label={label}
                        value={value}
                    />
                ))}
            </div>
        </Section>
    );
};

export const ContractDetailDialog = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title='Contract Details'
            description=''
            callToAction='Unwind Position'
            onClick={onClose}
        >
            <div className='grid w-full grid-cols-1 justify-items-stretch gap-6 text-white'>
                <Section>
                    <AmountCard
                        ccy={CurrencySymbol.FIL}
                        amount={5000}
                        price={8.3}
                    />
                </Section>
                <SectionWithItems
                    itemList={[
                        ['Contract Address', '0x0x1234567890'],
                        ['Contract Type', 'Borrow'],
                        ['Contract Status', 'Active'],
                        ['Contract Collateral', 'ETH'],
                        ['Contract Collateral Amount', '0.1 ETH'],
                        ['Contract Collateral Ratio', '150%'],
                    ]}
                />
                <SectionWithItems
                    itemList={[['Contract Borrowed Amount', '0.1 ETH']]}
                />
                <Disclosure>
                    {({ open }) => (
                        <>
                            <Disclosure.Button className='flex flex-row items-center justify-between'>
                                <h2 className='typography-hairline-2 py-4 text-left text-white'>
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
