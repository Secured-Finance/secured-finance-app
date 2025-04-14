import { CurrencySymbol } from 'src/utils';

export const OrderBookInfoTooltip = ({
    orderBookInfoData,
    currency,
}: {
    orderBookInfoData: {
        position: { top: number; left: number };
        avgPrice: string;
        avgApr: string;
        totalAmount: string;
        totalUsd: string;
    };
    currency: CurrencySymbol;
}) => {
    const { position, avgPrice, avgApr, totalAmount, totalUsd } =
        orderBookInfoData;

    return (
        <div
            className='fixed hidden min-w-44 flex-col gap-1 rounded-lg border border-neutral-500 bg-neutral-900 px-2 py-2 font-secondary opacity-90 shadow-md transition-opacity duration-200 laptop:flex'
            style={{
                top: position.top,
                left: position.left,
                transform: 'translate(-105%, -50%)',
                pointerEvents: 'none',
            }}
            role='tooltip'
            data-testid='orderBookTooltip'
        >
            <TooltipRow label='Avg. Price (VWAP)' value={avgPrice} />
            <TooltipRow label='Avg. APR' value={avgApr} />
            <TooltipRow label={`Total ${currency}`} value={totalAmount} />
            <TooltipRow label='Total USD' value={totalUsd} />
            <div className='absolute left-full top-1/2 -translate-y-1/2 border-y-[10px] border-l-[10px] border-y-transparent border-l-neutral-500' />
        </div>
    );
};

const TooltipRow = ({ label, value }: { label: string; value: string }) => (
    <div className='flex justify-between text-xs/4'>
        <span className='text-neutral-400'>{label}</span>
        <span className='text-neutral-50'>{value}</span>
    </div>
);
