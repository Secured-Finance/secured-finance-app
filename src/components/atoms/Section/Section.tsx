import clsx from 'clsx';
import WarningCircleIcon from 'src/assets/icons/warning-circle.svg';

export const Section = ({
    variant = 'default',
    children,
}: {
    variant?: 'default' | 'warning';
    children: React.ReactNode;
}) => {
    let interiorComponent: React.ReactNode = null;

    if (variant === 'default') {
        interiorComponent = <div className='px-6 py-4'>{children}</div>;
    }

    if (variant === 'warning') {
        interiorComponent = (
            <div
                className='flex flex-row items-start justify-start gap-1 px-3 py-4'
                role='alert'
            >
                <span>
                    <WarningCircleIcon
                        className='mt-1 h-5 w-5 text-orange'
                        role='img'
                        aria-label='warning'
                    />
                </span>
                {children}
            </div>
        );
    }

    return (
        <div
            className={clsx('rounded-xl border', {
                'border-neutral-3': variant === 'default',
                'bg-yellow/6 border-orange': variant === 'warning',
            })}
        >
            {interiorComponent}
        </div>
    );
};
