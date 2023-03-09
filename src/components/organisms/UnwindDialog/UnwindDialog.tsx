import { Disclosure } from '@headlessui/react';
import { OrderSide } from '@secured-finance/sf-client';
import { useSelector } from 'react-redux';
import {
    ExpandIndicator,
    Section,
    SectionWithItems,
} from 'src/components/atoms';
import {
    AmountCard,
    CollateralSimulationSection,
    Dialog,
    DialogState,
} from 'src/components/molecules';
import { useCollateralBook } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { Amount, Maturity } from 'src/utils/entities';
import { useWallet } from 'use-wallet';

export const UnwindDialog = ({
    isOpen,
    onClose,
    amount,
    maturity,
}: {
    amount: Amount;
    maturity: Maturity;
} & DialogState) => {
    const { account } = useWallet();
    const collateral = useCollateralBook(account);
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
                    <AmountCard amount={amount} price={price} />
                </Section>
                <CollateralSimulationSection
                    collateral={collateral}
                    tradeAmount={amount}
                    tradePosition={OrderSide.BORROW}
                    assetPrice={price}
                    type='unwind'
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
