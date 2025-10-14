import clsx from 'clsx';
import { Alignment } from 'src/types';
import { formatter } from 'src/utils';
import { LoanValue } from 'src/utils/entities';

export const PriceYieldItem = ({
    loanValue,
    align = 'right',
    compact = false,
    firstLineType = 'price',
}: {
    loanValue: LoanValue;
    align?: Alignment;
    compact?: boolean;
    firstLineType?: 'price' | 'rate';
}) => {
    return (
        <div
            className={clsx('flex flex-col', {
                'text-right': align === 'right',
                'text-center': align === 'center',
                'text-left': align === 'left',
                'w-12': !compact,
                'w-fit': compact,
            })}
        >
            <span
                className={clsx({
                    'typography-caption-2 font-numerical text-white': compact,
                    'typography-caption h-6 text-neutral-6': !compact,
                })}
            >
                {formatter.loanValue(firstLineType)(loanValue)}
            </span>
            {compact === false ? (
                <span className='typography-caption-2 h-5 text-neutral-4'>
                    {formatter.loanValue('rate')(loanValue)}
                </span>
            ) : null}
        </div>
    );
};
