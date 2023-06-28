export const HorizontalListItem = ({
    label,
    value,
}: {
    label: React.ReactNode;
    value: React.ReactNode;
}) => {
    return (
        <div className='typography-caption flex justify-between'>
            {typeof label === 'string' ? (
                <span className='text-planetaryPurple'>{label}</span>
            ) : (
                label
            )}
            {typeof value === 'string' ? (
                <span className='text-neutral-8'>{value}</span>
            ) : (
                value
            )}
        </div>
    );
};
