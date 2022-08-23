interface SeparatorProps {
    color?: string;
}

export const Separator = ({ color = 'default' }: SeparatorProps) => {
    switch (color) {
        case 'neutral-3':
            return (
                <div
                    className='border-b border-neutral-3'
                    data-testid={'separator'}
                />
            );
        case 'white-10':
            return (
                <div
                    className='border-b border-white-10'
                    data-testid={'separator'}
                />
            );
        case 'default':
            return (
                <div
                    className='border-b border-moonGrey border-opacity-30'
                    data-testid={'separator'}
                />
            );
    }
    return <div />;
};
