interface OrderBookInfoData {
    position: {
        top: number;
        left: number;
    };
    avgPrice: number;
    avgApr: number;
    totalAmount: number;
    totalUsd: number;
}

interface OrderBookInfoProps {
    OrderBookInfoData: OrderBookInfoData;
}

const formatToTwoDecimals = (num: number): string => {
    const scaled = num;
    const truncated = Math.floor(scaled * 100) / 100;
    return truncated.toFixed(2);
};

export const OrderBookInfo: React.FC<OrderBookInfoProps> = ({
    OrderBookInfoData,
}) => {
    return (
        <div className='hidden desktop:flex'>
            <div
                className='fixed flex w-48 flex-col gap-1 rounded-md border-2 border-[#64748B] bg-neutral-900 p-2.5 font-secondary text-sm text-neutral-50 opacity-90 shadow-md transition-opacity duration-200'
                style={{
                    top: OrderBookInfoData.position.top,
                    left: OrderBookInfoData.position.left,
                    transform: 'translate(-105%, -50%)',
                    pointerEvents: 'none',
                }}
            >
                <div className='flex justify-between'>
                    <span className='text-left text-neutral-400'>
                        Avg. Price:
                    </span>
                    <span className='text-right'>
                        {formatToTwoDecimals(OrderBookInfoData.avgPrice)}
                    </span>
                </div>
                <div className='flex justify-between'>
                    <span className='text-left text-neutral-400'>
                        Avg. APR:
                    </span>
                    <span className='text-right'>
                        {formatToTwoDecimals(OrderBookInfoData.avgApr)}%
                    </span>
                </div>
                <div className='flex justify-between'>
                    <span className='text-left text-neutral-400'>
                        Total Amount:
                    </span>
                    <span className='text-right'>
                        {OrderBookInfoData.totalAmount.toFixed(2)}
                    </span>
                </div>
                <div className='flex justify-between'>
                    <span className='text-left text-neutral-400'>
                        Total USD:
                    </span>
                    <span className='text-right'>
                        ${OrderBookInfoData.totalUsd.toFixed(2)}
                    </span>
                </div>

                <div className='absolute left-full top-1/2 -translate-y-1/2 rounded-md border-y-[10px] border-l-[10px] border-y-transparent border-l-[#64748B]' />
            </div>
        </div>
    );
};
