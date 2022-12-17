import { RadioGroup } from '@headlessui/react';
import { Side } from '@secured-finance/sf-client/dist/secured-finance-client';
import classNames from 'classnames';
import { NavTab } from 'src/components/atoms';

export const BorrowLendSelector = ({
    handleClick,
    side,
    variant,
}: {
    handleClick: (side: Side) => void;
    side: Side;
    variant: 'simple' | 'advanced';
}) => {
    return (
        <RadioGroup
            value={side}
            onChange={(v: Side) => handleClick(v)}
            as='div'
            className={classNames('flex flex-row items-center', {
                'h-16': variant === 'simple',
                'h-12 gap-1 rounded-lg bg-black-20 p-2': variant === 'advanced',
            })}
        >
            <RadioGroup.Option
                value={Side.BORROW}
                className='h-full w-1/2'
                as='button'
            >
                {({ checked }) =>
                    variant === 'simple' ? (
                        <NavTab text='Borrow' active={checked} />
                    ) : (
                        <BorrowLendButton text='Borrow' active={checked} />
                    )
                }
            </RadioGroup.Option>
            <RadioGroup.Option
                value={Side.LEND}
                className='h-full w-1/2'
                as='button'
            >
                {({ checked }) =>
                    variant === 'simple' ? (
                        <NavTab text='Lend' active={checked} />
                    ) : (
                        <BorrowLendButton text='Lend' active={checked} />
                    )
                }
            </RadioGroup.Option>
        </RadioGroup>
    );
};

const BorrowLendButton = ({
    active,
    text,
}: {
    active: boolean;
    text: 'Borrow' | 'Lend';
}) => {
    return (
        <div
            className={`typography-caption-2 group flex h-full w-full items-center justify-center rounded duration-300 hover:opacity-100 hover:ease-in-out ${
                active
                    ? 'bg-starBlue text-neutral-8'
                    : 'text-neutral-8 opacity-70'
            }`}
        >
            {text}
        </div>
    );
};
