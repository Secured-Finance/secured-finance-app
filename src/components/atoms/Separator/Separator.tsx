import clsx from 'clsx';

interface SeparatorProps {
    color?: 'neutral-2' | 'neutral-3' | 'moonGrey' | 'white-10' | 'default';
    orientation?: 'horizontal' | 'vertical';
}

export const Separator = ({
    color = 'default',
    orientation = 'horizontal',
}: SeparatorProps) => {
    return (
        <div
            className={clsx(
                {
                    'border-b': orientation === 'horizontal',
                    'border-l': orientation === 'vertical',
                },
                {
                    'border-neutral-2': color === 'neutral-2',
                    'border-neutral-3': color === 'neutral-3',
                    'border-moonGrey border-opacity-30': color === 'moonGrey',
                    'border-white-10': color === 'white-10',
                    'border-white-5': color === 'default',
                }
            )}
            data-testid={'separator'}
        />
    );
};
