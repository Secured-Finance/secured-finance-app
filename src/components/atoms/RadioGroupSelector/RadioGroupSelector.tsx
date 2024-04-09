import { RadioGroup } from '@headlessui/react';
import clsx from 'clsx';
import { NavStylesProps, NavTab } from 'src/components/atoms';

export const RadioGroupSelector = ({
    options,
    selectedOption,
    handleClick,
    variant,
    optionsStyles,
}: {
    options: string[];
    selectedOption: string;
    handleClick: (option: string) => void;
    variant: 'NavTab' | 'StyledButton';
    optionsStyles?: NavStylesProps[];
}) => {
    return (
        <RadioGroup
            value={selectedOption}
            onChange={handleClick}
            as='div'
            className={clsx('flex flex-row items-center', {
                'h-11 laptop:h-16': variant === 'NavTab',
                'h-12 gap-1 rounded-lg bg-black-20 p-2':
                    variant === 'StyledButton',
            })}
        >
            {options.map((option, index) => (
                <RadioGroup.Option
                    key={option}
                    value={option}
                    className='h-full flex-1'
                    as='button'
                >
                    {({ checked }) =>
                        variant === 'NavTab' ? (
                            <NavTab
                                text={option}
                                active={checked}
                                navStyles={
                                    optionsStyles && optionsStyles[index]
                                        ? optionsStyles[index]
                                        : undefined
                                }
                            />
                        ) : (
                            <StyledButton text={option} active={checked} />
                        )
                    }
                </RadioGroup.Option>
            ))}
        </RadioGroup>
    );
};

const StyledButton = ({ active, text }: { active: boolean; text: string }) => {
    return (
        <div
            className={clsx(
                'typography-caption-2 group flex h-full w-full items-center justify-center rounded font-semibold duration-300 hover:opacity-100 hover:ease-in-out',
                {
                    'bg-starBlue text-neutral-50': active,
                    'text-neutral-400 opacity-70': !active,
                }
            )}
        >
            {text}
        </div>
    );
};
