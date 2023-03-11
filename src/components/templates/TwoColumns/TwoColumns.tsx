export const TwoColumns = ({
    children,
}: {
    children: [React.ReactNode, React.ReactNode];
}) => {
    return (
        <div className='flex flex-row justify-between gap-6 pt-4'>
            <div className='w-2/3 min-w-[480px]'>{children[0]}</div>
            <div className='w-1/3 min-w-[240px]'>{children[1]}</div>
        </div>
    );
};
