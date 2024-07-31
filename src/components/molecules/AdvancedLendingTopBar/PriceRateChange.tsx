import { DailyMarketInfo } from 'src/types';
import { percentFormat } from 'src/utils';

const StaticRateDisplay = ({ value }: { value: string }) => {
    return (
        <div className='flex flex-col items-center gap-1 laptop:flex-row'>
            <span>{value}</span>
            <span>({value})</span>
        </div>
    );
};

export const PriceRateChange = ({
    marketInfo,
}: {
    marketInfo?: DailyMarketInfo;
}) => {
    const invalidPercentage = '-.--%';
    if (!marketInfo) {
        return <StaticRateDisplay value={invalidPercentage} />;
    }

    const { high, low, rateHigh, rateLow, isIncreased } = marketInfo;

    if (!high || !low || !rateHigh || !rateLow || isIncreased === undefined) {
        return <StaticRateDisplay value={invalidPercentage} />;
    }

    const priceHigh = parseFloat(high);
    const priceLow = parseFloat(low);
    const rateHighParsed = parseFloat(rateHigh);
    const rateLowParsed = parseFloat(rateLow);

    if (
        isNaN(priceHigh) ||
        isNaN(priceLow) ||
        isNaN(rateHighParsed) ||
        isNaN(rateLowParsed)
    ) {
        return <StaticRateDisplay value={invalidPercentage} />;
    }

    // Handle cases where both prices or both rates are 0.00
    if (
        (priceHigh === 0 && priceLow === 0) ||
        (rateHighParsed === 0 && rateLowParsed === 0)
    ) {
        return <StaticRateDisplay value={'0.00%'} />;
    }

    let percentageChange: number;
    let ratePercentageChange: number;

    if (isIncreased) {
        if (priceLow === 0 || rateLowParsed === 0) {
            return <StaticRateDisplay value={invalidPercentage} />;
        }
        percentageChange = ((priceHigh - priceLow) / priceLow) * 100;
        ratePercentageChange =
            ((rateHighParsed - rateLowParsed) / rateLowParsed) * 100;
    } else {
        if (priceHigh === 0 || rateHighParsed === 0) {
            return <StaticRateDisplay value={invalidPercentage} />;
        }
        percentageChange = ((priceLow - priceHigh) / priceHigh) * 100;
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

    return (
        <div className='flex flex-col items-center gap-1 laptop:flex-row'>
            <span>{formattedPercentage}</span>
            <span>({formattedRatePercentage})</span>
        </div>
    );
};
