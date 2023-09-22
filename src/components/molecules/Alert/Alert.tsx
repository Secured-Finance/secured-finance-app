import { InformationCircleIcon } from '@heroicons/react/24/solid';

export const Alert = ({
    severity,
    children,
}: {
    // TODO: extend severity to include more than just 'info'
    severity: Extract<'error' | 'info' | 'success' | 'warning', 'info'>;
    children: React.ReactNode;
}) => {
    return (
        <section
            aria-label={severity}
            role='alert'
            className='bg-[rgba(41, 45, 63, 0.60)] rounded-xl border border-white-10 shadow-tab'
        >
            <div className='flex w-full flex-row items-center justify-start gap-5 rounded-xl bg-gradient-to-b from-[rgba(111,116,176,0.35)] to-[rgba(57,77,174,0)] px-5 py-3'>
                <InformationCircleIcon className='h-6 w-6 text-planetaryPurple' />
                {children}
            </div>
        </section>
    );
};
