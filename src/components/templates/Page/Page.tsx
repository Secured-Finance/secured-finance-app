import React from 'react';

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
            className='mt-7 flex flex-col gap-4 px-3 tablet:min-w-[728px] tablet:px-5 laptop:min-w-[970px] laptop:px-7 desktop:min-w-[1120px] desktop:px-40'
            data-testid={name}
        >
            <div className='flex h-16 items-center justify-between border-b-[0.5px] border-panelStroke'>
                <span className='font-secondary text-smd font-light leading-7 text-white tablet:text-md laptop:text-lg'>
                    {title}
                </span>
                {titleComponent ? titleComponent : null}
            </div>
            <div className='flex flex-col gap-6'>
                {React.Children.map(children, (child, index) => {
                    return (
                        <div className='' key={`page-${name}-${index}`}>
                            {child}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
