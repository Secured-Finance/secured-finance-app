import clsx from 'clsx';
import { Separator } from 'src/components/atoms';

export const GradientBox = ({
    shape = 'rounded-bottom',
    header,
    variant,
    children,
}: {
    shape?: 'rectangle' | 'rounded-bottom';
    header?: string;
    variant?: 'default' | 'high-contrast';
    children: React.ReactNode;
}) => {
    return (
        <div>
            <div className='h-1 bg-starBlue'></div>
            <div
                className={clsx(
                    'border-b border-l border-r border-white-10 bg-black-20',
                    {
                        'rounded-b-2xl': shape === 'rounded-bottom',
                        'bg-gradient-to-b from-[rgba(106,118,177,0.1)] from-0% to-[rgba(106,118,177,0)] to-70%':
                            variant === 'default',
                        'bg-gradient-to-b from-[rgba(111,116,176,0.35)] to-[rgba(57,77,174,0)]':
                            variant === 'high-contrast',
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
