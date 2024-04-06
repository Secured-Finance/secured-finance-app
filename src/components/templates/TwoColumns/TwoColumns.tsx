import clsx from 'clsx';

export const TwoColumns = ({
    children,
    narrowFirstColumn = false,
}: {
    children: [React.ReactNode, React.ReactNode];
    narrowFirstColumn?: boolean;
}) => {
    const bigSize = 'w-full laptop:w-70%-gap-3';
    const smallSize = 'w-full laptop:w-30%-gap-3';

    return (
        <div className='flex flex-col justify-between gap-x-3 gap-y-4 px-3 laptop:flex-row laptop:px-0'>
            <div
                className={clsx({
                    [bigSize]: !narrowFirstColumn,
                    [smallSize]: narrowFirstColumn,
                })}
            >
                {children[0]}
            </div>
            <div
                className={clsx({
                    [bigSize]: narrowFirstColumn,
                    [smallSize]: !narrowFirstColumn,
                })}
            >
                {children[1]}
            </div>
        </div>
    );
};
