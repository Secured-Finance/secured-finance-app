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
        <div className='flex h-10 w-full flex-row items-center justify-between rounded-lg bg-black-20 py-2 pl-2 pr-4'>
            <div className='flex flex-row items-center gap-2'>
                <div className='typography-caption w-full text-neutral-5'>
                    {field}
                </div>
                {informationText && (
                    <InformationPopover>{informationText}</InformationPopover>
                )}
            </div>
            <div className=' text-right text-[16px] font-semibold leading-6 text-neutral-4'>
                {value}
            </div>
        </div>
    );
};
