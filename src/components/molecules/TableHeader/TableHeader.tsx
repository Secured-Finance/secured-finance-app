import { SortDirection } from '@tanstack/react-table';
import { SortArrows } from 'src/components/atoms';

export const TableHeader = ({
    title,
    sortingHandler,
    isSorted,
}: {
    title: string;
    sortingHandler: ((event: unknown) => void) | undefined;
    isSorted: boolean | SortDirection;
}) => (
    <button className='cursor-pointer select-none' onClick={sortingHandler}>
        <span className='flex flex-row items-center justify-center gap-1'>
            <span>{title}</span>
            <span>
                <SortArrows isSorted={isSorted} />
            </span>
        </span>
    </button>
);
