import { RadioGroup } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/outline';
import CircleOutline from 'src/assets/icons/circle-outline.svg';

import { formatDataCy } from 'src/utils';

const WalletOption = ({
    name,
    Icon,
}: {
    name: string;
    Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}) => {
    return (
        <RadioGroup.Option
            value={name}
            data-cy={formatDataCy(name.concat('-radio-option'))}
            className='relative flex cursor-pointer rounded-lg px-5 py-4 focus:outline-none'
        >
            {({ checked }) => (
                <>
                    <div className='flex w-full items-center justify-between space-x-12'>
                        <div className='flex items-center'>
                            <div className='text-sm'>
                                <RadioGroup.Label
                                    className={`font-medium  ${
                                        checked ? 'text-white' : 'text-black-30'
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
                            <div className='rounded-full border-2 border-neutral bg-starBlue text-white'>
                                <CheckIcon className='h-6 w-6' />
                            </div>
                        ) : (
                            <div className='rounded-full border-2 border-neutral text-white'>
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
    options,
}: {
    value: string;
    onChange: (v: string) => void;
    options: { name: string; Icon: React.FunctionComponent }[];
}) => {
    return (
        <RadioGroup
            value={value}
            onChange={onChange}
            className='w-full rounded-lg border border-neutral py-4'
            data-cy='radio-group'
        >
            {options.map(option => (
                <WalletOption
                    key={option.name}
                    name={option.name}
                    Icon={option.Icon}
                />
            ))}
        </RadioGroup>
    );
};
