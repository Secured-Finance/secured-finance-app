import { RadioGroup } from '@headlessui/react';
import clsx from 'clsx';
import { Tab, TabVariant } from 'src/components/atoms';

export const TabGroup = ({
    options,
    selectedOption,
    handleClick,
    isFullHeight,
}: {
    options: {
        text: string;
        variant: TabVariant;
    }[];
    selectedOption: string;
    handleClick: (option: string) => void;
    isFullHeight?: boolean;
}) => {
    return (
        <RadioGroup
            value={selectedOption}
            onChange={handleClick}
            as='div'
            className={clsx('flex flex-row items-center', {
                'h-full': isFullHeight,
            })}
        >
            {options.map((option, index) => (
                <RadioGroup.Option
                    key={`${option.text}-${index}`}
                    value={option.text}
                    className='h-full flex-1'
                    as='button'
                >
                    {({ checked }) => (
                        <Tab
                            text={option.text}
                            active={checked}
                            isFullHeight
                            variant={option.variant}
                        />
                    )}
                </RadioGroup.Option>
            ))}
        </RadioGroup>
    );
};
