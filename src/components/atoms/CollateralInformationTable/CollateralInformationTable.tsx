import {
    CollateralInformation,
    CollateralInformationProps,
} from '../CollateralInformation';

interface CollateralInformationTableProps {
    data: CollateralInformationProps[];
}

export const CollateralInformationTable = ({
    data,
}: CollateralInformationTableProps) => {
    return (
        <div className='flex w-full flex-col gap-2 rounded-b-[4px] bg-[rgba(41,45,63,0.74)] pt-2'>
            <div className='typography-dropdown-selection-label flex h-5 justify-between px-4 text-white-50'>
                <span>Asset</span>
                <span>Balance</span>
            </div>
            <div className='h-[1px] w-full bg-neutral-3'></div>
            {data.map((asset, index) => {
                return (
                    <div key={asset.asset} className='h-16 px-4'>
                        <CollateralInformation {...asset} />
                        {data.length - 1 !== index && (
                            <div className='mt-5 h-[1px] w-full bg-neutral-3'></div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
