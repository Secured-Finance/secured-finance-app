import { RadioGroup } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/solid';
import { SVGProps } from 'react';
import { ReactComponent as CircleOutline } from 'src/assets/icons/circle-outline.svg';
import { ReactComponent as MetaMaskIcon } from 'src/assets/img/metamask-fox.svg';
import { ReactComponent as WalletConnectIcon } from 'src/assets/img/wallet-connect.svg';

const WalletOption = ({
    name,
    Icon,
}: {
    name: string;
    Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}) => {
    return (
        <RadioGroup.Option
            value={name}
            className='
    focus:outline-none relative flex cursor-pointer rounded-lg px-5 py-4'
        >
            {({ checked }) => (
                <>
                    <div className='flex w-full items-center justify-between'>
                        <div className='flex items-center'>
                            <div className='text-sm'>
                                <RadioGroup.Label
                                    className={`font-medium  ${
                                        checked ? 'text-white' : 'text-gray-900'
                                    }`}
                                >
                                    <span className='flex'>
                                        <Icon className='h-6 w-6' />
                                        <p className='ml-6 text-white'>
                                            {name}
                                        </p>
                                    </span>
                                </RadioGroup.Label>
                            </div>
                        </div>
                        {checked ? (
                            <div className='border-secondary-400 bg-primary-500 rounded-full border-2 text-white'>
                                <CheckIcon className='h-6 w-6' />
                            </div>
                        ) : (
                            <div className='border-secondary-300 rounded-full border-2 text-white'>
                                <CircleOutline className='h-6 w-6' />
                            </div>
                        )}
                    </div>
                </>
            )}
        </RadioGroup.Option>
    );
};
export const WalletRadioGroup = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) => {
    return (
        <RadioGroup
            value={value}
            onChange={onChange}
            className='rounded-lg border border-moonGrey border-opacity-40 py-4'
        >
            <WalletOption name='Metamask' Icon={MetaMaskIcon} />
            <WalletOption name='WalletConnect' Icon={WalletConnectIcon} />
        </RadioGroup>
    );
};
