import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Button } from 'src/components/atoms';
import { CoreTable } from 'src/components/molecules';
import { EmergencySettlementStep } from 'src/components/templates';
import { Position, useTerminationPrices } from 'src/hooks';
import { usdFormat } from 'src/utils';
import {
    amountColumnDefinition,
    loanTypeFromFVColumnDefinition,
    withdrawableAssetColumnDefinition,
} from 'src/utils/tableDefinitions';

export type WithdrawablePosition = Pick<
    Position,
    'currency' | 'maturity' | 'amount' | 'forwardValue'
> & { type: 'position' | 'collateral' | 'lending-order' };

const columnHelper = createColumnHelper<WithdrawablePosition>();

export const WithdrawPositionTable = ({
    data,
    onRedeem,
    netValue,
}: {
    data: WithdrawablePosition[];
    onRedeem: () => void;
    netValue: number;
}) => {
    const priceList = useTerminationPrices().data;

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

    return (
        <EmergencySettlementStep
            step='1. Redeem Your Active Contracts and Collateral Currencies'
            showStep
        >
            {data.length !== 0 && (
                <>
                    <div className='bg-black-20 px-5 pb-3 font-normal'>
                        <CoreTable
                            data={data}
                            columns={columns}
                            options={{
                                name: 'emergency-step-1',
                                responsive: false,
                            }}
                        />
                    </div>
                    <div className='grid grid-cols-2 grid-rows-2 place-items-center justify-items-center gap-5 pl-4 pr-7 pt-3 tablet:grid-cols-6 tablet:grid-rows-1'>
                        <span className='col-span-2 row-start-2 flex flex-row items-center justify-start gap-4 border-white-20 pr-4 tablet:col-span-4 tablet:row-start-1 tablet:border-r'>
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

                        <span className='row-start-1 grid grid-flow-row place-items-end gap-y-1'>
                            <span className='typography-caption-2 leading-4 text-slateGray'>
                                Net Value
                            </span>
                            <span className='typography-body-2 font-semibold leading-4 text-neutral-8'>
                                {usdFormat(netValue)}
                            </span>
                        </span>
                        <Button className='row-start-1' onClick={onRedeem}>
                            Redeem
                        </Button>
                    </div>
                </>
            )}
        </EmergencySettlementStep>
    );
};
