import { useMemo, useState } from 'react';
import {
    CollateralTabLeftPane,
    CollateralTabRightPane,
} from 'src/components/molecules';
import {
    DepositCollateral,
    WithdrawCollateral,
} from 'src/components/organisms';
import {
    CollateralBook,
    useCollateralBalances,
    useCollateralCurrencies,
    useCurrencies,
} from 'src/hooks';
import {
    CollateralInfo,
    CurrencySymbol,
    amountFormatterFromBase,
    currencyMap,
} from 'src/utils';
import { useAccount } from 'wagmi';

export const generateCollateralList = (
    balance: Partial<Record<CurrencySymbol, number | bigint>>,
    useAllCurrencies: boolean,
    currencies: CurrencySymbol[]
): Record<CurrencySymbol, CollateralInfo> => {
    let collateralRecords: Record<string, CollateralInfo> = {};
    currencies
        ?.map(ccy => currencyMap[ccy])
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
                                  balance[ccy] as bigint
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
    totalPVOfOpenOrdersInUSD,
}: {
    collateralBook: CollateralBook;
    totalPVOfOpenOrdersInUSD: number;
}) => {
    const { address } = useAccount();
    const [openModal, setOpenModal] = useState<'' | 'deposit' | 'withdraw'>('');

    const collateralBalances = useCollateralBalances();
    const { data: collateralCurrencies = [] } = useCollateralCurrencies();
    const { data: currencies = [] } = useCurrencies();

    const depositCollateralList = useMemo(
        () =>
            generateCollateralList(
                collateralBalances,
                false,
                collateralCurrencies
            ),
        [collateralBalances, collateralCurrencies]
    );

    const withdrawCollateralList = useMemo(
        () =>
            generateCollateralList(
                {
                    ...collateralBook.withdrawableCollateral,
                    ...collateralBook.nonCollateral,
                },
                true,
                currencies
            ),
        [
            collateralBook.nonCollateral,
            collateralBook.withdrawableCollateral,
            currencies,
        ]
    );

    return (
        <div className='flex w-full flex-row items-center'>
            <CollateralTabLeftPane
                onClick={step => setOpenModal(step)}
                account={address}
                collateralBook={collateralBook}
                totalPVOfOpenOrdersInUSD={totalPVOfOpenOrdersInUSD}
            />
            <CollateralTabRightPane
                account={address}
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
