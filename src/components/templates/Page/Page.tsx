import { Children } from 'react';

export const Page = ({
    title,
    titleComponent,
    alertComponent,
    children,
    name,
}: {
    title: string;
    titleComponent?: React.ReactNode;
    alertComponent?: React.ReactNode;
    children: React.ReactNode;
    name?: string;
}) => {
    return (
        <div
            className='mx-auto mt-3 flex flex-col gap-2 tablet:min-w-[728px] laptop:mt-6 laptop:min-w-[970px] laptop:gap-4 laptop:px-6 desktop:min-w-[1120px] desktop:max-w-[1920px]'
            data-testid={name}
        >
            {alertComponent && (
                <div className='px-3 laptop:px-0'>{alertComponent}</div>
            )}
            <div className='flex items-center justify-between border-panelStroke px-4 pb-3 laptop:border-b-[0.5px] laptop:px-0 laptop:pb-7'>
                <span className='font-secondary text-smd font-light leading-7 text-white tablet:text-md laptop:text-lg'>
                    {title}
                </span>
                {titleComponent ? titleComponent : null}
            </div>
            <div className='flex flex-col gap-6'>
                {Children.map(children, (child, index) => {
                    if (child) {
                        return <div key={`page-${name}-${index}`}>{child}</div>;
                    }
                })}
            </div>
        </div>
    );
};
