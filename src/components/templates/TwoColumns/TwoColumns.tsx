import classNames from 'classnames';

export const TwoColumns = ({
    children,
    narrowFirstColumn = false,
}: {
    children: [React.ReactNode, React.ReactNode];
    narrowFirstColumn?: boolean;
}) => {
    const bigSize = 'w-[70%]';
    const smallSize = 'w-[30%]';

    return (
        <div className='flex flex-row justify-between gap-6 pt-4'>
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
