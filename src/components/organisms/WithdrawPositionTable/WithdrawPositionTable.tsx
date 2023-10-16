import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'src/components/atoms';
import { CoreTable } from 'src/components/molecules';
import { Position } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { computeNetValue, usdFormat } from 'src/utils';
import {
    amountColumnDefinition,
    loanTypeFromFVColumnDefinition,
    withdrawableAssetColumnDefinition,
} from 'src/utils/tableDefinitions';

type WithdrawablePosition = Pick<
    Position,
    'currency' | 'maturity' | 'amount' | 'forwardValue'
> & { type: 'position' | 'collateral' };

const columnHelper = createColumnHelper<WithdrawablePosition>();

export const WithdrawPositionTable = ({
    data,
}: {
    data: WithdrawablePosition[];
}) => {
    const priceList = useSelector((state: RootState) => getPriceMap(state));

    const columns = useMemo(
        () => [
            withdrawableAssetColumnDefinition(
                columnHelper,
                'Asset',
                'contract'
            ),
            loanTypeFromFVColumnDefinition(columnHelper, 'Type', 'side'),
            amountColumnDefinition(
                columnHelper,
                'Snapshot Value',
                'amount',
                row => row.amount,
                {
                    color: true,
                    priceList: priceList,
                    compact: false,
                },
                undefined,
                'right'
            ),
        ],
        [priceList]
    );

    const netValue = useMemo(
        () => computeNetValue(data, priceList),
        [data, priceList]
    );

    return (
        <div className='grid grid-flow-row rounded-2xl border border-white-10 bg-cardBackground/60 text-white shadow-tab'>
            <h1 className='typography-body-2 h-16 px-4 pb-6 pt-5'>
                1. Redeem Your Active Contracts and Collateral Currencies
            </h1>
            {data.length !== 0 && (
                <div className='bg-black-20 px-5 pb-7'>
                    <CoreTable data={data} columns={columns} />
                </div>
            )}
            <div className='flex flex-row justify-around gap-5 pb-5 pl-4 pr-7 pt-3'>
                <span className='flex w-2/3 flex-row items-center justify-start gap-4 border-r border-white-20 pr-8 '>
                    <span>
                        <InformationCircleIcon className='h-5 w-5 text-planetaryPurple' />
                    </span>
                    <span className='typography-dropdown-selection-label text-justify text-planetaryPurple'>
                        Net value redemptions are based on our collateral
                        vault&apos;s ratio of its currencies, regardless of the
                        user&apos;s initial asset. Non-collateral assets are not
                        factored in but are accessible during the subsequent
                        withdrawal step.
                    </span>
                </span>

                <span className='grid grid-flow-row place-items-end'>
                    <span className='typography-caption-2 leading-4 text-slateGray'>
                        Net Value
                    </span>
                    <span className='typography-body-2 font-semibold leading-4 text-neutral-8'>
                        {usdFormat(netValue)}
                    </span>
                </span>
                <Button>Redeem</Button>
            </div>
        </div>
    );
};