import { PencilIcon, TrashIcon } from '@heroicons/react/outline';
import { BigNumber } from 'ethers';
import { useOrders } from 'src/hooks';
import { CurrencySymbol } from 'src/utils';
import { Maturity } from 'src/utils/entities';

export const OpenOrderActionCell = ({
    ccy,
    maturity,
    orderId,
}: {
    ccy: CurrencySymbol;
    maturity: Maturity;
    orderId: BigNumber;
}) => {
    const { handleCancelOrder } = useOrders();

    return (
        <div className='flex flex-row justify-center gap-3 text-planetaryPurple'>
            <PencilIcon className='h-4' />
            <button onClick={() => handleCancelOrder(orderId, ccy, maturity)}>
                <TrashIcon className='h-4' />
            </button>
        </div>
    );
};
