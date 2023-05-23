import { SortDirection } from '@tanstack/react-table';
import classNames from 'classnames';
import { useState } from 'react';
import { SortArrows } from 'src/components/atoms';

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
    const [open, setOpen] = useState(false);

    return (
        <Container align={align}>
            <button
                className='relative cursor-pointer select-none'
                onClick={sortingHandler}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
            >
                <span className='flex flex-row items-center justify-center gap-1'>
                    <span>{title}</span>
                    {isSorted !== undefined && (
                        <span data-testid='sorting-icons'>
                            <SortArrows isSorted={isSorted} />
                        </span>
                    )}
                </span>
                {open && titleHint && (
                    <div className='typography-caption-3 absolute z-50 mt-2 h-fit w-[180px] rounded-lg border border-black-20 bg-gunMetal p-4 text-left font-normal text-neutral-8 shadow-dropdown'>
                        {titleHint}
                    </div>
                )}
            </button>
        </Container>
    );
};

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
