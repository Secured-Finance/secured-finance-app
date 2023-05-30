import { BigNumber } from 'ethers';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { CollateralTabLeftPane } from 'src/components/molecules';
import {
    DepositCollateral,
    WithdrawCollateral,
} from 'src/components/organisms';
import { CollateralBook } from 'src/hooks';
import { RootState } from 'src/store/types';
import { selectCollateralCurrencyBalance } from 'src/store/wallet';
import {
    CollateralInfo,
    CurrencySymbol,
    amountFormatterFromBase,
    getCurrencyMapAsList,
} from 'src/utils';
import { useWallet } from 'use-wallet';

export const generateCollateralList = (
    balance: Partial<Record<CurrencySymbol, number | BigNumber>>,
    useAllCurrencies: boolean
): Record<CurrencySymbol, CollateralInfo> => {
    let collateralRecords: Record<string, CollateralInfo> = {};

    getCurrencyMapAsList()
        .filter(ccy => ccy.isCollateral || useAllCurrencies)
        .forEach(currencyInfo => {
            const ccy = currencyInfo.symbol;
            const collateralInfo = {
                [ccy]: {
                    symbol: ccy,
                    name: ccy,
                    available: balance[ccy]
                        ? typeof balance[ccy] === 'number'
                            ? (balance[ccy] as number)
                            : amountFormatterFromBase[ccy](
                                  balance[ccy] as BigNumber
                              )
                        : 0,
                },
            };
            collateralRecords = { ...collateralRecords, ...collateralInfo };
        });

    return collateralRecords;
};

export const CollateralTab = ({
    collateralBook,
}: {
    collateralBook: CollateralBook;
}) => {
    const { account } = useWallet();
    const [openModal, setOpenModal] = useState<'' | 'deposit' | 'withdraw'>('');

    const balances = useSelector((state: RootState) =>
        selectCollateralCurrencyBalance(state)
    );

    const depositCollateralList = useMemo(
        () => generateCollateralList(balances, false),
        [balances]
    );

    const withdrawCollateralList = useMemo(
        () =>
            generateCollateralList(
                {
                    ...collateralBook.withdrawableCollateral,
                    ...collateralBook.nonCollateral,
                },
                true
            ),
        [collateralBook.nonCollateral, collateralBook.withdrawableCollateral]
    );

    return (
        <div className='flex h-fit min-h-[400px] w-full flex-col tablet:flex-row'>
            <CollateralTabLeftPane
                onClick={step => setOpenModal(step)}
                account={account}
                collateralBook={collateralBook}
            />
            <DepositCollateral
                isOpen={openModal === 'deposit'}
                onClose={() => setOpenModal('')}
                collateralList={depositCollateralList}
                source='Collateral Tab'
            ></DepositCollateral>
            <WithdrawCollateral
                isOpen={openModal === 'withdraw'}
                onClose={() => setOpenModal('')}
                collateralList={withdrawCollateralList}
                source='Collateral Tab'
            ></WithdrawCollateral>
        </div>
    );
};
