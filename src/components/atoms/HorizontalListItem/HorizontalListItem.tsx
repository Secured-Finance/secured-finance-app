export const HorizontalListItem = ({
    label,
    value,
}: {
    label: string;
    value: string;
}) => {
    return (
        <div className='typography-caption grid w-full grid-cols-2 justify-around'>
            <span className='text-left text-planetaryPurple'>{label}</span>
            <span className='text-right text-neutral-8'>{value}</span>
        </div>
    );
};
