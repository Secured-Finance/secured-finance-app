import { createColumnHelper } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { Button } from 'src/components/atoms';
import { CoreTable } from 'src/components/molecules';
import { WithdrawCollateral } from 'src/components/organisms';
import { EmergencySettlementStep } from 'src/components/templates';
import { useTerminationPrices } from 'src/hooks';
import {
    CollateralInfo,
    CurrencySymbol,
    amountFormatterFromBase,
    currencyMap,
    hexToCurrencySymbol,
} from 'src/utils';
import {
    amountColumnDefinition,
    tableHeaderDefinition,
    withdrawableAssetColumnDefinition,
} from 'src/utils/tableDefinitions';

type TokenPosition = {
    currency: `0x${string}`;
    amount: bigint;
};

const columnHelper = createColumnHelper<
    TokenPosition & {
        type: 'collateral';
        maturity: number;
    }
>();

export const WithdrawTokenTable = ({ data }: { data: TokenPosition[] }) => {
    const priceList = useTerminationPrices().data;
    const [openModal, setOpenModal] = useState(false);

    const collateral: Record<CurrencySymbol, CollateralInfo> = data.reduce(
        (acc, { currency, amount }) => {
            const ccy = hexToCurrencySymbol(currency);
            if (!ccy) return acc;
            return {
                ...acc,
                [ccy]: {
                    symbol: ccy,
                    name: currencyMap[ccy].name,
                    availableFullValue: amount,
                    available: amountFormatterFromBase[ccy](amount),
                },
            };
        },
        {} as Record<CurrencySymbol, CollateralInfo>
    );

    const [currencyToWithdraw, setCurrencyToWithdraw] = useState<
        CurrencySymbol | undefined
    >();

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
                    color: false,
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
                        <div className='flex justify-end px-1'>
                            <Button
                                onClick={() => {
                                    setCurrencyToWithdraw(
                                        hexToCurrencySymbol(
                                            info.row.original.currency
                                        )
                                    );
                                    setOpenModal(true);
                                }}
                            >
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
        <>
            <EmergencySettlementStep
                step='2. Withdraw Your Asset from Token Vault'
                showStep
            >
                {data.length !== 0 && (
                    <div className='bg-black-20 px-5 pb-3 font-normal'>
                        <CoreTable
                            data={data.map(o => {
                                return {
                                    ...o,
                                    type: 'collateral' as const,
                                    maturity: 0,
                                    responsive: false,
                                };
                            })}
                            columns={columns}
                            options={{
                                name: 'emergency-step-2',
                                stickyHeader: false,
                            }}
                        />
                    </div>
                )}
            </EmergencySettlementStep>
            <WithdrawCollateral
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                collateralList={collateral}
                selected={currencyToWithdraw}
            ></WithdrawCollateral>
        </>
    );
};
