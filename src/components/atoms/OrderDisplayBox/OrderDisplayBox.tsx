import { InformationPopover } from 'src/components/atoms';

interface OrderDisplayBoxProps {
    field: string;
    value: number | string;
    informationText?: string;
}

export const OrderDisplayBox = ({
    field,
    value,
    informationText,
}: OrderDisplayBoxProps) => {
    return (
        <div className='typography-caption flex h-6 w-full flex-row items-center justify-between bg-transparent'>
            <div className='flex flex-row items-center gap-2'>
                <div className='text-slateGray'>{field}</div>
                {informationText && (
                    <InformationPopover>{informationText}</InformationPopover>
                )}
            </div>
            <div className='text-right text-planetaryPurple'>{value}</div>
        </div>
    );
};
