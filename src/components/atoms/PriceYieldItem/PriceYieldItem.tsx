import classNames from 'classnames';
import { formatLoanValue } from 'src/utils';
import { LoanValue } from 'src/utils/entities';

export const PriceYieldItem = ({
    loanValue,
    align = 'right',
    compact = false,
    firstLineType = 'price',
}: {
    loanValue: LoanValue;
    align?: 'left' | 'right' | 'center';
    compact?: boolean;
    firstLineType?: Parameters<typeof formatLoanValue>[1];
}) => {
    return (
        <div
            className={classNames('flex w-12 flex-col', {
                'text-right': align === 'right',
                'text-center': align === 'center',
                'text-left': align === 'left',
            })}
        >
            <span
                className={classNames(
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
