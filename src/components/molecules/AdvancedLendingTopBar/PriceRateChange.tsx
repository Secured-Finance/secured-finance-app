import { percentFormat } from 'src/utils';

const StaticRateDisplay = ({ value }: { value: string }) => {
    return (
        <div className='flex items-center gap-1'>
            <span>{value}</span>
            <span>({value})</span>
        </div>
    );
};

export const PriceRateChange = ({
    priceHigh,
    priceLow,
    rateHigh,
    rateLow,
    isIncreased,
}: {
    priceHigh?: string;
    priceLow?: string;
    rateHigh?: string;
    rateLow?: string;
    isIncreased?: boolean;
}) => {
    const invalidPercentage = '-.--%';

    if (
        !priceHigh ||
        !priceLow ||
        !rateHigh ||
        !rateLow ||
        isIncreased === undefined
    ) {
        return <StaticRateDisplay value={invalidPercentage} />;
    }

    const high = parseFloat(priceHigh);
    const low = parseFloat(priceLow);
    const rateHighParsed = parseFloat(rateHigh);
    const rateLowParsed = parseFloat(rateLow);

    if (
        isNaN(high) ||
        isNaN(low) ||
        isNaN(rateHighParsed) ||
        isNaN(rateLowParsed)
    ) {
        return <StaticRateDisplay value={invalidPercentage} />;
    }

    // Handle case where both values are 0.00
    if (high === 0 && low === 0) {
        return <StaticRateDisplay value={'0.00%'} />;
    }

    // Handle case where both rates are 0.00%
    if (rateHighParsed === 0 && rateLowParsed === 0) {
        return <StaticRateDisplay value={'0.00%'} />;
    }

    let percentageChange: number;
    let ratePercentageChange: number;

    if (isIncreased) {
        if (low === 0 || rateLowParsed === 0) {
            return <StaticRateDisplay value={invalidPercentage} />;
        }
        percentageChange = ((high - low) / low) * 100;
        ratePercentageChange =
            ((rateHighParsed - rateLowParsed) / rateLowParsed) * 100;
    } else {
        if (high === 0 || rateHighParsed === 0) {
            return <StaticRateDisplay value={invalidPercentage} />;
        }
        percentageChange = ((low - high) / high) * 100;
        ratePercentageChange =
            ((rateLowParsed - rateHighParsed) / rateHighParsed) * 100;
    }

    const formattedPercentage = percentFormat(percentageChange, 100, 2, 2);
    const formattedRatePercentage = percentFormat(
        ratePercentageChange,
        100,
        2,
        2
    );

    const sign = isIncreased ? '+' : '-';

    return (
        <div className='flex items-center gap-1'>
            <span>
                {sign}
                {formattedPercentage}
            </span>
            <span>
                ({sign}
                {formattedRatePercentage})
            </span>
        </div>
    );
};
