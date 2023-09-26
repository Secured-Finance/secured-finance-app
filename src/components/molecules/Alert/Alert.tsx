import { InformationCircleIcon } from '@heroicons/react/24/solid';
import ErrorIcon from 'src/assets/icons/error.svg';

export const Alert = ({
    severity = 'info',
    children,
}: {
    // TODO: extend severity to include more than just 'info'
    severity: 'error' | 'info' | 'success' | 'warning';
    children: React.ReactNode;
}) => {
    let alertIcon;
    switch (severity) {
        case 'error':
            alertIcon = <ErrorIcon className='h-6 w-6' />;
            break;
        default:
            alertIcon = (
                <InformationCircleIcon className='h-6 w-6 text-planetaryPurple' />
            );
            break;
    }
    return (
        <section
            aria-label={severity}
            role='alert'
            className='bg-[rgba(41, 45, 63, 0.60)] rounded-xl border border-white-10 shadow-tab'
        >
            <div className='flex w-full flex-row items-center justify-start gap-5 rounded-xl bg-gradient-to-b from-[rgba(111,116,176,0.35)] to-[rgba(57,77,174,0)] px-5 py-3'>
                {alertIcon}
                {children}
            </div>
        </section>
    );
};
