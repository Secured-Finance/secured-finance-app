import { CurrencySymbol } from 'src/utils';

export const OrderBookInfoTooltip = ({
    orderBookInfoData,
    currency,
}: {
    orderBookInfoData: {
        position: { top: number; left: number };
        avgPrice: string;
        avgApr: string;
        totalAmount: number;
        totalUsd: string;
    };
    currency: CurrencySymbol;
}) => {
    const { position, avgPrice, avgApr, totalAmount, totalUsd } =
        orderBookInfoData;

    return (
        <div
            className='fixed hidden min-w-44 flex-col gap-1 rounded-lg border-2 border-[#64748B] bg-neutral-900 px-2 py-2 font-secondary text-xs/4 text-neutral-50 opacity-90 shadow-md transition-opacity duration-200 desktop:flex'
            style={{
                top: position.top,
                left: position.left,
                transform: 'translate(-105%, -50%)',
                pointerEvents: 'none',
            }}
            role='tooltip'
        >
            <div className='flex justify-between gap-1'>
                <span className='text-neutral-400'>Avg. Price (VWAP)</span>
                <span>{avgPrice}</span>
            </div>
            <div className='flex justify-between'>
                <span className='text-neutral-400'>Avg. APR</span>
                <span>{avgApr}%</span>
            </div>
            <div className='flex justify-between'>
                <span className='text-neutral-400'>Total {currency}</span>
                <span>{totalAmount}</span>
            </div>
            <div className='flex justify-between'>
                <span className='text-neutral-400'>Total USD</span>
                <span>{totalUsd}</span>
            </div>
            <div className='absolute left-full top-1/2 -translate-y-1/2 rounded-md border-y-[10px] border-l-[10px] border-y-transparent border-l-[#64748B]' />
        </div>
    );
};
