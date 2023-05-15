import classNames from 'classnames';

export const Chip = ({ label }: { label: 'Borrow' | 'Lend' }) => {
    return (
        <div
            className={classNames(
                'flex h-6 w-[70px] items-center justify-center rounded border',
                {
                    'border-galacticOrange': label === 'Borrow',
                    'border-nebulaTeal': label === 'Lend',
                }
            )}
        >
            <span
                className={classNames(
                    'typography-pill-label px-2 py-1 text-center',
                    {
                        'text-galacticOrange': label === 'Borrow',
                        'text-nebulaTeal': label === 'Lend',
                    }
                )}
            >
                {label}
            </span>
        </div>
    );
};
