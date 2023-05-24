import classNames from 'classnames';

export const TwoColumns = ({
    children,
    narrowFirstColumn = false,
}: {
    children: [React.ReactNode, React.ReactNode];
    narrowFirstColumn?: boolean;
}) => {
    const bigSize = 'tablet:w-[70%]';
    const smallSize = 'tablet:w-[30%]';

    return (
        <div className='flex flex-col justify-between gap-6 pt-4 tablet:flex-row'>
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
