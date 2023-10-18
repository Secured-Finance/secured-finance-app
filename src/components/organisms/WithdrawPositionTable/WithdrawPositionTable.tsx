import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'src/components/atoms';
import { CoreTable } from 'src/components/molecules';
import { EmergencySettlementStep } from 'src/components/templates';
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
                    color: false,
                    priceList: priceList,
                    compact: false,
                    showCurrency: true,
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
        <EmergencySettlementStep
            step='1. Redeem Your Active Contracts and Collateral Currencies'
            showStep
        >
            {data.length !== 0 && (
                <>
                    <div className='bg-black-20 px-5 pb-7 font-normal'>
                        <CoreTable data={data} columns={columns} />
                    </div>
                    <div className='flex flex-row justify-around gap-5 pl-4 pr-7 pt-3'>
                        <span className='flex w-2/3 flex-row items-center justify-start gap-4 border-r border-white-20 pr-8 '>
                            <span>
                                <InformationCircleIcon className='h-5 w-5 text-planetaryPurple' />
                            </span>
                            <span className='typography-dropdown-selection-label text-left text-planetaryPurple'>
                                Net value redemptions are based on our
                                collateral vault&apos;s ratio of its currencies,
                                regardless of the user&apos;s initial asset.
                                Non-collateral assets are not factored in but
                                are accessible during the subsequent withdrawal
                                step.
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
                </>
            )}
        </EmergencySettlementStep>
    );
};
