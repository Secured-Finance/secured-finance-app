export const HorizontalListItem = ({
    label,
    value,
}: {
    label: string;
    value: string;
}) => {
    return (
        <div className='typography-caption grid w-full grid-cols-2 justify-around font-bold'>
            <span className='text-left text-planetaryPurple'>{label}</span>
            <span className='text-right text-white'>{value}</span>
        </div>
    );
};
