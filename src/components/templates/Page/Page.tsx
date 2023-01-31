export const Page = ({
    title,
    titleComponent,
    children,
}: {
    title: string;
    titleComponent?: React.ReactNode;
    children: React.ReactNode;
}) => {
    return (
        <>
            <div className='flex h-16 justify-between border-b-[0.5px] border-panelStroke'>
                <span className='font-secondary text-lg font-light leading-7 text-white'>
                    {title}
                </span>
                {titleComponent ? titleComponent : null}
            </div>
            {children}
        </>
    );
};
