import classNames from 'classnames';

interface SeparatorProps {
    color?: 'neutral' | 'moonGrey' | 'default';
}

export const Separator = ({ color = 'default' }: SeparatorProps) => {
    return (
        <div
            className={classNames('border-b', {
                'border-neutral-3': color === 'neutral',
                'border-moonGrey border-opacity-30': color === 'moonGrey',
                'border-white-5': color === 'default',
            })}
            data-testid={'separator'}
        />
    );
};
