import { createColumnHelper } from '@tanstack/react-table';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'src/components/atoms';
import { CoreTable } from 'src/components/molecules';
import { EmergencySettlementStep } from 'src/components/templates';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import {
    amountColumnDefinition,
    tableHeaderDefinition,
    withdrawableAssetColumnDefinition,
} from 'src/utils/tableDefinitions';

type TokenPosition = {
    currency: `0x${string}`;
    amount: BigNumber;
};

const columnHelper = createColumnHelper<
    TokenPosition & {
        type: 'collateral';
        maturity: number;
    }
>();

export const WithdrawTokenTable = ({ data }: { data: TokenPosition[] }) => {
    const priceList = useSelector((state: RootState) => getPriceMap(state));

    const columns = useMemo(
        () => [
            withdrawableAssetColumnDefinition(
                columnHelper,
                'Asset',
                'contract'
            ),
            amountColumnDefinition(
                columnHelper,
                'Snapshot Value',
                'amount',
                row => row.amount,
                {
                    color: true,
                    priceList: priceList,
                    compact: false,
                    showCurrency: true,
                },
                undefined,
                'right'
            ),
            columnHelper.accessor('currency', {
                id: 'action',
                cell: info => {
                    return (
                        <div className='flex justify-center px-1'>
                            <Button onClick={() => {}} size='sm'>
                                Withdraw
                            </Button>
                        </div>
                    );
                },
                header: tableHeaderDefinition('Action', undefined, 'right'),
            }),
        ],
        [priceList]
    );

    return (
        <EmergencySettlementStep
            step='2. Withdraw Your Asset from Token Vault'
            showStep
        >
            {data.length !== 0 && (
                <div className='bg-black-20 px-5 pb-7'>
                    <CoreTable
                        data={data.map(o => {
                            return {
                                ...o,
                                type: 'collateral' as const,
                                maturity: 0,
                            };
                        })}
                        columns={columns}
                    />
                </div>
            )}
        </EmergencySettlementStep>
    );
};
