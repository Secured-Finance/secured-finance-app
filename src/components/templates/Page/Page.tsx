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
            className='mt-7 flex min-w-[1024px] flex-col gap-6 px-40'
            data-testid={name}
        >
            <div className='flex h-16 min-w-[1024px] justify-between border-b-[0.5px] border-panelStroke'>
                <span className='font-secondary text-lg font-light leading-7 text-white'>
                    {title}
                </span>
                {titleComponent ? titleComponent : null}
            </div>
            <div className='flex flex-col gap-6'>
                {React.Children.map(children, (child, index) => {
                    return (
                        <div
                            className='min-w-[1024px]'
                            key={`page-${name}-${index}`}
                        >
                            {child}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
