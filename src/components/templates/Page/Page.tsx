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
            className='mt-7 flex flex-col gap-4 px-5 desktop:gap-6 desktop:px-40'
            data-testid={name}
        >
            <div className='flex h-16 items-center justify-between border-b-[0.5px] border-panelStroke'>
                <span className='font-secondary text-smd font-light leading-7 text-white tablet:text-md desktop:text-lg'>
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
