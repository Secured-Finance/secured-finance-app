export const ThreeColumnsWithTopBar = ({
    topBar,
    children,
}: {
    topBar: React.ReactNode;
    children: [React.ReactNode, React.ReactNode, React.ReactNode];
}) => {
    return (
        <div
            className='grid h-fit grid-cols-1 place-items-stretch gap-x-3
            tablet:grid-cols-2 laptop:grid-cols-12 laptop:gap-y-4'
        >
            <div className='order-1 tablet:col-span-2 laptop:col-span-12'>
                {topBar}
            </div>
            <div className='order-2 mb-4 block tablet:col-span-2 laptop:mb-0 laptop:hidden'>
                {children[0]}
            </div>
            <div className='order-4 grid grid-cols-12 gap-3 tablet:col-span-2 laptop:col-span-9 laptop:flex laptop:flex-wrap'>
                {children[1]}
            </div>
            <div className='order-3 tablet:col-span-2 laptop:order-4 laptop:col-span-3'>
                {children[2]}
            </div>
        </div>
    );
};
