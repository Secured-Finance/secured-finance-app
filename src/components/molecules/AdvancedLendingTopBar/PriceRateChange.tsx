import clsx from 'clsx';
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
        Number.isNaN(priceHigh) ||
        Number.isNaN(priceLow) ||
        Number.isNaN(rateHighParsed) ||
        Number.isNaN(rateLowParsed)
    ) {
        return <StaticRateDisplay value={invalidPercentage} />;
    }

    const bothPricesZero = priceHigh === 0 && priceLow === 0;
    const bothRatesZero = rateHighParsed === 0 && rateLowParsed === 0;

    if (bothPricesZero || bothRatesZero) {
        return <StaticRateDisplay value='0.00%' />;
    }

    let percentageChange: number;
    let ratePercentageChange: number;

    console.log('isIncreased', isIncreased);

    if (isIncreased) {
        if (priceLow === 0 || rateLowParsed === 0) {
            return <StaticRateDisplay value={invalidPercentage} />;
        }
        percentageChange = ((priceHigh - priceLow) / priceLow) * 100;
        ratePercentageChange = rateHighParsed - rateLowParsed;
    } else {
        if (priceHigh === 0 || rateHighParsed === 0) {
            return <StaticRateDisplay value={invalidPercentage} />;
        }
        percentageChange = ((priceLow - priceHigh) / priceHigh) * 100;
        ratePercentageChange = rateLowParsed - rateHighParsed;
    }

    const formattedPercentage = percentFormat(percentageChange, 100, 2, 2);

    const isZeroAPR = ratePercentageChange === 0;
    const isDecreasedAPR = ratePercentageChange.toString().includes('-');

    return (
        <div className='flex flex-col items-center gap-1 laptop:flex-row'>
            <span
                className={clsx({
                    'text-success-300': isIncreased === true,
                    'text-error-300': isIncreased === false,
                })}
            >
                {isIncreased && '+'}
                {formattedPercentage}
            </span>
            <span
                className={clsx({
                    'text-success-300': isDecreasedAPR === false && !isZeroAPR,
                    'text-error-300': isDecreasedAPR === true && !isZeroAPR,
                })}
            >
                ({ratePercentageChange.toFixed(2)}% APR)
            </span>
        </div>
    );
};
