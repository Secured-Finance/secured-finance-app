export const TwoColumnsWithTopBar = ({
    topBar,
    children,
}: {
    topBar: React.ReactNode;
    children: [React.ReactNode, React.ReactNode];
}) => {
    return (
        <div className='min-w-[720px]'>
            <div className='w-full'>{topBar}</div>
            <div className='flex flex-row justify-between gap-6 pt-4'>
                <div className='w-1/3'>{children[0]}</div>
                <div className='w-2/3'>{children[1]}</div>
            </div>
        </div>
    );
};
