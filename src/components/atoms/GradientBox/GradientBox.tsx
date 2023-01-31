import React from 'react';

export const GradientBox = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className='h-1 w-full bg-starBlue'></div>
            <div className='rounded-b-2xl border-l border-r border-b border-white-10 bg-gradient-to-b from-[rgba(106,118,177,0.1)] via-[rgba(106,118,177,0)] to-black-20 shadow-tab'>
                {children}
            </div>
        </>
    );
};
