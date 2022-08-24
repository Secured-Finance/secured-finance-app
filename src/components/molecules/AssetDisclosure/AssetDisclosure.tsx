import {
    Disclosure as HeadlessDisclosure,
    Transition,
} from '@headlessui/react';
import Ledger from 'src/assets/img/ledger.svg';
import MetamaskFox from 'src/assets/img/metamask-fox.svg';
import {
    CollateralInformationTable,
    ExpandIndicator,
} from 'src/components/atoms';
import { CollateralInformationProps } from 'src/components/atoms/CollateralInformation';
import { AddressUtils } from 'src/utils';

export interface AssetDisclosureProps {
    data: CollateralInformationProps[];
    walletSource: 'metamask' | 'ledger';
    account: string;
}

export const AssetDisclosure = ({
    data,
    walletSource,
    account,
}: AssetDisclosureProps) => {
    return (
        <HeadlessDisclosure>
            {({ open }) => (
                <>
                    <div className='relative h-full'>
                        <HeadlessDisclosure.Button className='flex h-11 w-full flex-row items-center gap-3 focus:outline-none'>
                            {walletSource === 'metamask' ? (
                                <MetamaskFox className='h-11 w-11 p-[10px]' />
                            ) : (
                                <Ledger className='h-11 w-11 p-[10px]' />
                            )}
                            <span className='typography-caption text-grayScale'>
                                {accountFormater(account, walletSource)}
                            </span>
                            <div className='absolute right-3'>
                                <ExpandIndicator expanded={open} />
                            </div>
                        </HeadlessDisclosure.Button>
                        <Transition
                            show={open}
                            enter='transition duration-100 ease-out'
                            enterFrom='transform scale-95 opacity-0'
                            enterTo='transform scale-100 opacity-100'
                        >
                            <HeadlessDisclosure.Panel className='px-1 pt-2'>
                                <CollateralInformationTable data={data} />
                            </HeadlessDisclosure.Panel>
                        </Transition>
                    </div>
                </>
            )}
        </HeadlessDisclosure>
    );
};

const accountFormater = (
    account: string,
    walletSource: 'metamask' | 'ledger'
) => {
    return walletSource === 'metamask'
        ? AddressUtils.format(account, 6)
        : AddressUtils.format(account, 12);
};
