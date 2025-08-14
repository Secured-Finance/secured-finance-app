import { RadioGroup } from '@headlessui/react';
import clsx from 'clsx';

export type ViewType = 'Simple' | 'Advanced';

export const SimpleAdvancedSelector = ({
    handleClick,
    text,
}: {
    handleClick: (view: ViewType) => void;
    text: ViewType;
}) => {
    return (
        <RadioGroup
            value={text}
            onChange={(v: ViewType) => handleClick(v)}
            as='div'
            className='flex h-10 w-fit flex-row items-center rounded-full bg-black-20 p-[2px] shadow-selector'
        >
            <RadioGroup.Option
                aria-label='Simple'
                value='Simple'
                className='h-full w-1/2'
                as='button'
            >
                {({ checked }) => (
                    <SimpleAdvancedButton text='Simple' active={checked} />
                )}
            </RadioGroup.Option>
            <RadioGroup.Option
                aria-label='Advanced'
                value='Advanced'
                className='-ml-3 h-full w-1/2'
                as='button'
            >
                {({ checked }) => (
                    <SimpleAdvancedButton text='Advanced' active={checked} />
                )}
            </RadioGroup.Option>
        </RadioGroup>
    );
};

const SimpleAdvancedButton = ({
    active,
    text,
}: {
    active: boolean;
    text: ViewType;
}) => {
    return (
        <div
            className={clsx(
                'typography-caption flex h-full w-fit items-center justify-center rounded-full px-4 duration-300 hover:opacity-100 hover:ease-in-out desktop:px-5',
                {
                    'bg-starBlue text-white': active,
                    'text-white opacity-40': !active,
                },
            )}
        >
            {text}
        </div>
    );
};
