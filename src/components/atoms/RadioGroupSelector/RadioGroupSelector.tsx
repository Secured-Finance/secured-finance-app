import { RadioGroup } from '@headlessui/react';
import classNames from 'classnames';
import { NavTab } from 'src/components/atoms';

export const RadioGroupSelector = ({
    options,
    selectedOption,
    handleClick,
    variant,
}: {
    options: string[];
    selectedOption: string;
    handleClick: (option: string) => void;
    variant: 'NavTab' | 'StyledButton';
}) => {
    return (
        <RadioGroup
            value={selectedOption}
            onChange={handleClick}
            as='div'
            className={classNames('flex flex-row items-center', {
                'h-16': variant === 'NavTab',
                'h-12 gap-1 rounded-lg bg-black-20 p-2':
                    variant === 'StyledButton',
            })}
        >
            {options.map(option => (
                <RadioGroup.Option
                    key={option}
                    value={option}
                    className='h-full flex-1'
                    as='button'
                >
                    {({ checked }) =>
                        variant === 'NavTab' ? (
                            <NavTab text={option} active={checked} />
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
            className={classNames(
                'typography-caption-2 group flex h-full w-full items-center justify-center rounded font-semibold duration-300 hover:opacity-100 hover:ease-in-out',
                {
                    'bg-starBlue text-neutral-8': active,
                    'text-neutral-4 opacity-70': !active,
                }
            )}
        >
            {text}
        </div>
    );
};
