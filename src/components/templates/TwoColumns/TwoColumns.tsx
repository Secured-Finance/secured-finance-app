export const TwoColumns = ({
    children,
}: {
    children: [React.ReactNode, React.ReactNode];
}) => {
    return (
        <div className='flex flex-row justify-between gap-6 pt-4'>
            <div className='w-[70%]'>{children[0]}</div>
            <div className='w-[30%]'>{children[1]}</div>
        </div>
    );
};
