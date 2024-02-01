import { ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export const SortArrows = ({
    isSorted,
}: {
    isSorted: boolean | 'asc' | 'desc';
}) => {
    return (
        <div className='flex flex-col'>
            <ChevronDownIcon
                data-testid='up-sort-arrows'
                className={clsx('-mb-0.5 h-3 w-3 rotate-180 ', {
                    'text-white': isSorted === 'asc',
                    'text-slateGray': isSorted === false || isSorted === 'desc',
                })}
            />
            <ChevronDownIcon
                data-testid='down-sort-arrows'
                className={clsx('-mt-0.5 h-3 w-3', {
                    'text-white': isSorted === 'desc',
                    'text-slateGray': isSorted === false || isSorted === 'asc',
                })}
            />
        </div>
    );
};
