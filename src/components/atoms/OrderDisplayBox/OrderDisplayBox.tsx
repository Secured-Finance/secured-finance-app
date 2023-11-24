import { InfoToolTip } from 'src/components/molecules';

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
                    <InfoToolTip
                        maxWidth='small'
                        align='right'
                        iconSize='small'
                    >
                        {informationText}
                    </InfoToolTip>
                )}
            </div>
            <div className='text-right text-planetaryPurple'>{value}</div>
        </div>
    );
};
