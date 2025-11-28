import { toBytes32 } from '@secured-finance/sf-graph-client';
import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { DropdownSelector, RadioButton } from 'src/components/atoms';
import { HistoricalChart } from 'src/components/molecules';
import { useGraphClientHook, useTransactionCandleStickData } from 'src/hooks';
import { selectLandingOrderForm } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { HistoricalDataIntervals } from 'src/types';
import { timeScales } from './constants';

export type Transaction = {
    average: string;
    close: string;
    currency: string;
    high: string;
    interval: string;
    low: string;
    maturity: string;
    open: string;
    timestamp: string;
    volume: string;
    volumeInFV: string;
};

type HistoricalWidgetProps = {
    sharedTimeScale?: HistoricalDataIntervals;
    onTimeScaleChange?: (timeScale: HistoricalDataIntervals) => void;
    historicalTradeData?: {
        data?: { transactionCandleSticks?: Transaction[] };
    };
};

export const HistoricalWidget = ({
    sharedTimeScale,
    onTimeScaleChange: onTimeScaleChangeProp,
    historicalTradeData: historicalTradeDataProp,
}: HistoricalWidgetProps) => {
    const { currency, maturity } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );
    const [internalTimeScale, setInternalTimeScale] =
        useState<HistoricalDataIntervals>(HistoricalDataIntervals['5M']);

    const selectedTimeScale = sharedTimeScale ?? internalTimeScale;

    const shouldSkipInternalQuery = !!historicalTradeDataProp;

    const internalHistoricalTradeDataRaw = useGraphClientHook(
        {
            interval: selectedTimeScale,
            currency: toBytes32(currency),
            maturity: maturity,
        },
        queries.TransactionCandleStickDocument
    );

    const internalHistoricalTradeData = shouldSkipInternalQuery
        ? { data: undefined }
        : internalHistoricalTradeDataRaw;

    const historicalTradeData =
        historicalTradeDataProp ?? internalHistoricalTradeData;

    const data = useTransactionCandleStickData(
        historicalTradeData as {
            data?: { transactionCandleSticks?: Transaction[] };
        },
        selectedTimeScale
    );

    const onTimeScaleChange = (time: string) => {
        const newTimeScale = time as HistoricalDataIntervals;
        if (onTimeScaleChangeProp) {
            onTimeScaleChangeProp(newTimeScale);
        } else {
            setInternalTimeScale(newTimeScale);
        }
    };

    return (
        <>
            <div
                data-testid='timescale-selector'
                className='flex items-center justify-between border-neutral-700 bg-gunMetal/60 px-4 py-2 laptop:border-b desktop:py-2.5'
            >
                <div className='flex w-[65px] laptop:w-[75px] desktop:hidden'>
                    <DropdownSelector
                        optionList={timeScales}
                        selected={{
                            value: selectedTimeScale as string,
                            label: selectedTimeScale as string,
                        }}
                        onChange={(time: string) => onTimeScaleChange(time)}
                        variant='fullWidth'
                    />
                </div>
                <div className='hidden desktop:flex'>
                    <RadioButton
                        options={timeScales}
                        value={selectedTimeScale}
                        onChange={(time: string) => onTimeScaleChange(time)}
                    />
                </div>
            </div>
            <HistoricalChart data={data} timeScale={selectedTimeScale} />
        </>
    );
};
