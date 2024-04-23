export const ThreeColumnsWithTopBar = ({
    topBar,
    children,
}: {
    topBar: React.ReactNode;
    children: [React.ReactNode, React.ReactNode, React.ReactNode];
}) => {
    return (
        <div className='grid h-fit grid-cols-1 place-items-stretch gap-x-3 gap-y-4 tablet:grid-cols-2 laptop:grid-cols-4'>
            <div className='tablet:col-span-2 laptop:col-span-4'>{topBar}</div>
            <div className='tablet:col-span-2 laptop:col-span-1'>
                {children[0]}
            </div>
            <div className='hidden laptop:col-span-1 laptop:block'>
                {children[1]}
            </div>
            <div className='laptop:col-span-2'>{children[2]}</div>
        </div>
    );
};
