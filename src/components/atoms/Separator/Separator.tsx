import classNames from 'classnames';

interface SeparatorProps {
    color?: 'neutral' | 'white' | 'default';
}

export const Separator = ({ color = 'default' }: SeparatorProps) => {
    return (
        <div
            className={classNames('border-b', {
                'border-neutral-3': color === 'neutral',
                'border-white-10': color === 'white',
                'border-moonGrey border-opacity-30': color === 'default',
            })}
            data-testid={'separator'}
        />
    );
};
