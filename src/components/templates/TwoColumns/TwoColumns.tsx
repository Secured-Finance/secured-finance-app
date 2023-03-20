export const TwoColumns = ({
    children,
}: {
    children: [React.ReactNode, React.ReactNode];
}) => {
    return (
        <div className='flex min-w-[720px] flex-row justify-between gap-6 pt-4'>
            <div className='w-2/3'>{children[0]}</div>
            <div className='w-1/3'>{children[1]}</div>
        </div>
    );
};
