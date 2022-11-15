import { SortDirection } from '@tanstack/react-table';
import classNames from 'classnames';
import { SortArrows } from 'src/components/atoms';

export const TableHeader = ({
    title,
    sortingHandler,
    isSorted,
    align,
}: {
    title: string;
    sortingHandler?: ((event: unknown) => void) | undefined;
    isSorted?: boolean | SortDirection;
    align?: 'left' | 'center' | 'right';
}) => (
    <Container align={align}>
        <button className='cursor-pointer select-none' onClick={sortingHandler}>
            <span className='flex flex-row items-center justify-center gap-1'>
                <span>{title}</span>
                {isSorted !== undefined && (
                    <span data-testid='sorting-icons'>
                        <SortArrows isSorted={isSorted} />
                    </span>
                )}
            </span>
        </button>
    </Container>
);
const Container = ({
    align,
    children,
}: {
    align?: 'left' | 'center' | 'right';
    children: React.ReactNode;
}) => {
    if (align) {
        return (
            <div
                data-testid='table-header-wrapper'
                className={classNames('flex', {
                    'justify-start': align === 'left',
                    'justify-center': align === 'center',
                    'justify-end': align === 'right',
                })}
            >
                {children}
            </div>
        );
    }
    return <>{children}</>;
};
