import { RadioGroup } from '@headlessui/react';
import CheckIcon from 'src/assets/icons/check.svg';
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
                            <RadioGroup.Label>
                                <span className='flex items-center'>
                                    <Icon className='h-8 w-8' />
                                    <p className='typography-body-2 ml-6 text-grayScale'>
                                        {name}
                                    </p>
                                </span>
                            </RadioGroup.Label>
                        </div>
                        {checked ? (
                            <CheckIcon className='h-6 w-6' />
                        ) : (
                            <div className='rounded-full border border-neutral'>
                                <CircleOutline className='h-[22px] w-[22px]' />
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
