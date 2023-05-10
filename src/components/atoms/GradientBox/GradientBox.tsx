import classNames from 'classnames';
import React from 'react';
import { Separator } from 'src/components/atoms';

export const GradientBox = ({
    shape = 'rounded-bottom',
    header,
    children,
}: {
    shape?: 'rectangle' | 'rounded-bottom';
    header?: string;
    children: React.ReactNode;
}) => {
    return (
        <div>
            <div className='h-1 bg-starBlue'></div>
            <div
                className={classNames(
                    'border-b border-l border-r border-white-10 bg-gradient-to-b from-[rgba(106,118,177,0.1)] via-[rgba(106,118,177,0)] to-black-20 shadow-tab',
                    {
                        'rounded-b-2xl': shape === 'rounded-bottom',
                    }
                )}
            >
                {header ? (
                    <>
                        <div className='typography-body-2 flex items-center justify-center whitespace-nowrap py-5 text-white'>
                            {header}
                        </div>
                        <Separator />
                    </>
                ) : null}
                {children}
            </div>
        </div>
    );
};
