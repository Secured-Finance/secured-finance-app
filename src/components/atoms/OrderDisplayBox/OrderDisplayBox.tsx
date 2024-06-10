import { InfoToolTip } from 'src/components/molecules';

interface OrderDisplayBoxProps {
    field: string;
    value: number | string;
    informationText?: React.ReactNode;
}

export const OrderDisplayBox = ({
    field,
    value,
    informationText,
}: OrderDisplayBoxProps) => {
    return (
        <div className='laptop:typography-caption flex h-4 w-full flex-row items-center justify-between bg-transparent text-[11px] laptop:h-6'>
            <div className='flex flex-row items-center gap-2'>
                <div className='text-slateGray'>{field}</div>
                {informationText && (
                    <InfoToolTip iconSize='small' placement='bottom-start'>
                        {informationText}
                    </InfoToolTip>
                )}
            </div>
            <div className='text-right text-planetaryPurple'>{value}</div>
        </div>
    );
};
