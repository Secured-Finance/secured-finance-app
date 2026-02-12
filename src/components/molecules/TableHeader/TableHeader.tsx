import { SortDirection } from '@tanstack/react-table';
import clsx from 'clsx';
import { SortArrows } from 'src/components/atoms';
import { Tooltip } from 'src/components/molecules';
import { Alignment } from 'src/types';

export const TableHeader = ({
    title,
    titleHint,
    sortingHandler,
    isSorted,
    align,
    horizontalPadding = true,
}: {
    title: string;
    titleHint?: React.ReactNode;
    sortingHandler?: ((event: unknown) => void) | undefined;
    isSorted?: boolean | SortDirection;
    align?: Alignment;
    horizontalPadding?: boolean;
}) => {
    const titleComponent = (
        <button
            className='relative cursor-pointer select-none'
            onClick={sortingHandler}
        >
            <span className='flex flex-row items-center justify-center gap-1'>
                <span>{title}</span>
                {isSorted !== undefined && (
                    <span data-testid='sorting-icons'>
                        <SortArrows isSorted={isSorted} />
                    </span>
                )}
            </span>
        </button>
    );

    if (titleHint) {
        return (
            <Container align={align} horizontalPadding={horizontalPadding}>
                <Tooltip placement='bottom' iconElement={titleComponent}>
                    {titleHint}
                </Tooltip>
            </Container>
        );
    }

    return (
        <Container align={align} horizontalPadding={horizontalPadding}>
            {titleComponent}
        </Container>
    );
};

const Container = ({
    align = 'center',
    horizontalPadding,
    children,
}: {
    align?: Alignment;
    horizontalPadding: boolean;
    children: React.ReactNode;
}) => {
    return (
        <div
            data-testid='table-header-wrapper'
            className={clsx('flex', {
                'justify-start': align === 'left',
                'justify-center': align === 'center',
                'justify-end': align === 'right',
                'px-2': horizontalPadding,
            })}
        >
            {children}
        </div>
    );
};
