export const CollateralUsageSection = ({
    available,
    usage,
}: {
    available: number;
    usage: number;
}) => {
    return (
        <div className='flex max-w-sm flex-row justify-between'>
            <div className='flex-col'>
                <h3 className='typography-caption-2 text-planetaryPurple'>
                    Available to borrow
                </h3>
                <p className='typography-caption font-bold  text-white'>
                    {available}
                </p>
            </div>
            <div className='flex-col'>
                <h3 className='typography-caption-2 text-planetaryPurple'>
                    Collateral Usage
                </h3>
                <p className='typography-caption text-right font-bold text-white'>
                    {usage}
                </p>
            </div>
        </div>
    );
};
