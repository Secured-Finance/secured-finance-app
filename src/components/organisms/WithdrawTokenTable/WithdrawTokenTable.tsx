import { createColumnHelper } from '@tanstack/react-table';
import { BigNumber } from 'ethers';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'src/components/atoms';
import { CoreTable } from 'src/components/molecules';
import { WithdrawCollateral } from 'src/components/organisms';
import { EmergencySettlementStep } from 'src/components/templates';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
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
                    available: amountFormatterFromBase[ccy](amount),
                },
            };
        },
        {} as Record<CurrencySymbol, CollateralInfo>
    );

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
                cell: () => {
                    return (
                        <div className='flex justify-end px-1'>
                            <Button
                                onClick={() => {
                                    setOpenModal(true);
                                }}
                                size='sm'
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
                    <div className='bg-black-20 px-5 pb-7 font-normal'>
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
            <WithdrawCollateral
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                collateralList={collateral}
            ></WithdrawCollateral>
        </>
    );
};
