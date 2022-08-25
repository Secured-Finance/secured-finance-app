import {
    CollateralInformation,
    CollateralInformationProps,
} from '../CollateralInformation';
import { Separator } from '../Separator';

interface CollateralInformationTableProps {
    data: CollateralInformationProps[];
}

export const CollateralInformationTable = ({
    data,
}: CollateralInformationTableProps) => {
    return (
        <div className='flex w-full flex-col gap-2 rounded-b bg-cardBackground/[0.74] pt-2'>
            <div className='typography-dropdown-selection-label flex h-5 justify-between px-4 text-white-50'>
                <span>Asset</span>
                <span>Balance</span>
            </div>
            <Separator color='neutral' />
            {data.map((asset, index) => {
                return (
                    <div key={asset.asset} className='h-16 px-4'>
                        <CollateralInformation {...asset} />
                        {data.length - 1 !== index && (
                            <div className='mt-5'>
                                <Separator color='neutral' />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
