import classNames from 'classnames';

export const TwoColumns = ({
    children,
    narrowFirstColumn = false,
}: {
    children: [React.ReactNode, React.ReactNode];
    narrowFirstColumn?: boolean;
}) => {
    const bigSize = 'w-full tablet:w-[70%]';
    const smallSize = 'w-full tablet:w-[30%]';

    return (
        <div className='flex-col justify-between gap-6 pt-4 laptop:flex laptop:flex-row'>
            <div
                className={classNames({
                    [bigSize]: !narrowFirstColumn,
                    [smallSize]: narrowFirstColumn,
                })}
            >
                {children[0]}
            </div>
            <div
                className={classNames({
                    [bigSize]: narrowFirstColumn,
                    [smallSize]: !narrowFirstColumn,
                })}
            >
                {children[1]}
            </div>
        </div>
    );
};
