export const HorizontalListItem = ({
    label,
    value,
}: {
    label: string;
    value: string;
}) => {
    return (
        <div className='typography-caption flex justify-between'>
            <span className='text-planetaryPurple'>{label}</span>
            <span className='text-neutral-8'>{value}</span>
        </div>
    );
};
