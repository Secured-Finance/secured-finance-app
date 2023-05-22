import { RadioGroup } from '@headlessui/react';

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
                className='h-full w-1/2'
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
            className={`typography-caption flex h-full w-[100px] items-center justify-center rounded-full duration-300 hover:opacity-100 hover:ease-in-out mobile:w-16 ${
                active ? 'bg-starBlue text-white' : 'text-white opacity-40'
            }`}
        >
            {text}
        </div>
    );
};
