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

export const HorizontalListItemTable = ({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) => {
    return (
        <div className='flex justify-between py-[3px]'>
            <span className='text-3 leading-4 text-neutral-200'>{label}</span>
            {value}
        </div>
    );
};
