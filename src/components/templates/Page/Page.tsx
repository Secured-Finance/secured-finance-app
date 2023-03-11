export const Page = ({
    title,
    titleComponent,
    children,
    name,
}: {
    title: string;
    titleComponent?: React.ReactNode;
    children: React.ReactNode;
    name?: string;
}) => {
    return (
        <div
            className='mt-7 flex min-w-fit flex-col gap-6 px-40'
            data-testid={name}
        >
            <div className='flex h-16 justify-between border-b-[0.5px] border-panelStroke'>
                <span className='font-secondary text-lg font-light leading-7 text-white'>
                    {title}
                </span>
                {titleComponent ? titleComponent : null}
            </div>
            {children}
        </div>
    );
};
