import { Disclosure } from '@headlessui/react';
import {
    ExpandIndicator,
    Section,
    SectionWithItems,
} from 'src/components/atoms';
import { AmountCard, Dialog, DialogState } from 'src/components/molecules';
import { CurrencySymbol } from 'src/utils';
import { Amount } from 'src/utils/entities';

export const ContractDetailDialog = ({ isOpen, onClose }: DialogState) => {
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
                        amount={
                            new Amount(
                                '5000000000000000000000',
                                CurrencySymbol.FIL
                            )
                        }
                        price={8.3}
                    />
                </Section>
                <SectionWithItems
                    itemList={[
                        ['Contract Address', '0x0x1234567890'],
                        ['Contract Type', 'Borrow'],
                        ['Contract Status', 'Active'],
                        ['Contract Collateral', 'ETH'],
                        ['Borrow Limit Remaining', '0.1 ETH'],
                        ['Contract Collateral Ratio', '150%'],
                    ]}
                />
                <SectionWithItems
                    itemList={[['Contract Borrowed Amount', '0.1 ETH']]}
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
