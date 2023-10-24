import { SortDirection } from '@tanstack/react-table';
import classNames from 'classnames';
import { SortArrows } from 'src/components/atoms';
import { Tooltip } from 'src/components/templates';

export const TableHeader = ({
    title,
    titleHint,
    sortingHandler,
    isSorted,
    align,
}: {
    title: string;
    titleHint?: string;
    sortingHandler?: ((event: unknown) => void) | undefined;
    isSorted?: boolean | SortDirection;
    align?: 'left' | 'center' | 'right';
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
            <Container align={align}>
                <Tooltip iconElement={titleComponent}>{titleHint}</Tooltip>
            </Container>
        );
    }

    return <Container align={align}>{titleComponent}</Container>;
};

const Container = ({
    align = 'center',
    children,
}: {
    align?: 'left' | 'center' | 'right';
    children: React.ReactNode;
}) => {
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
};
