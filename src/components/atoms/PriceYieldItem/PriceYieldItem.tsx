import clsx from 'clsx';
import { Alignment } from 'src/types';
import { formatLoanValue } from 'src/utils';
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
    firstLineType?: Parameters<typeof formatLoanValue>[1];
}) => {
    return (
        <div
            className={clsx('flex w-12 flex-col', {
                'text-right': align === 'right',
                'text-center': align === 'center',
                'text-left': align === 'left',
            })}
        >
            <span
                className={clsx(
                    {
                        'typography-caption-2': compact === true,
                        'typography-caption': compact === false,
                    },
                    'h-6 text-neutral-6'
                )}
            >
                {formatLoanValue(loanValue, firstLineType)}
            </span>
            {compact === false ? (
                <span className='typography-caption-2 h-5 text-neutral-4'>
                    {formatLoanValue(loanValue, 'rate')}
                </span>
            ) : null}
        </div>
    );
};
