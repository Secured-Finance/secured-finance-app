import clsx from 'clsx';

export const ErrorInfo = ({
    errorMessage,
    showError,
    align = 'right',
}: {
    errorMessage: string;
    showError: boolean;
    align?: 'left' | 'right';
}) => {
    return showError ? (
        <div
            className={clsx('flex w-full px-2', {
                'justify-start': align === 'left',
                'justify-end': align === 'right',
            })}
        >
            <p className='typography-caption-2 text-galacticOrange'>
                {errorMessage}
            </p>
        </div>
    ) : null;
};
