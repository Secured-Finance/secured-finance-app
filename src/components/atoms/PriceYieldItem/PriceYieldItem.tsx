import classNames from 'classnames';
import { formatLoanValue } from 'src/utils';
import { LoanValue } from 'src/utils/entities';

export const PriceYieldItem = ({
    loanValue,
    align = 'left',
}: {
    loanValue: LoanValue;
    align?: 'left' | 'right' | 'center';
}) => {
    return (
        <div
            className={classNames('flex w-12 flex-col', {
                'text-right': align === 'right',
                'text-center': align === 'center',
                'text-left': align === 'left',
            })}
        >
            <span className='typography-caption-2 h-6 text-neutral-6'>
                {formatLoanValue(loanValue, 'price')}
            </span>
            <span className='typography-caption-2 h-5 text-neutral-4'>
                {formatLoanValue(loanValue, 'rate')}
            </span>
        </div>
    );
};
