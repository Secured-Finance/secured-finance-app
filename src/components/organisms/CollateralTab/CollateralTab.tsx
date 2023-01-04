import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    CollateralTabLeftPane,
    CollateralTabRightPane,
} from 'src/components/molecules';
import { CollateralBook } from 'src/hooks';
import { selectEthereumBalance } from 'src/store/ethereumWallet';
import { RootState } from 'src/store/types';
import {
    amountFormatterFromBase,
    CollateralInfo,
    collateralList,
    CurrencySymbol,
} from 'src/utils';
import { useWallet } from 'use-wallet';
import { DepositCollateral } from '../DepositCollateral';
import { WithdrawCollateral } from '../WithdrawCollateral';

const generateCollateralList = (
    available: number
): Record<CurrencySymbol, CollateralInfo> => {
    let collateralRecords: Record<string, CollateralInfo> = {};
    for (let i = 0; i < collateralList.length; i++) {
        const currencyInfo = collateralList[i];
        const collateralInfo = {
            [currencyInfo.symbol]: {
                symbol: currencyInfo.symbol,
                name: currencyInfo.name,
                available: available,
            },
        };
        collateralRecords = { ...collateralRecords, ...collateralInfo };
    }
    return collateralRecords;
};

export const CollateralTab = ({
    collateralBook,
}: {
    collateralBook: CollateralBook;
}) => {
    const { account } = useWallet();
    const [openModal, setOpenModal] = useState<'' | 'deposit' | 'withdraw'>('');

    const balance = useSelector((state: RootState) =>
        selectEthereumBalance(state)
    );

    const depositCollateralList = useMemo(
        () => generateCollateralList(balance),
        [balance]
    );
    const withdrawCollateralList = useMemo(
        () =>
            generateCollateralList(
                amountFormatterFromBase[CurrencySymbol.ETH](
                    collateralBook.collateral
                )
            ),
        [collateralBook.collateral]
    );

    return (
        <div className='flex h-[410px] w-full flex-row'>
            <CollateralTabLeftPane
                onClick={step => setOpenModal(step)}
                account={account}
                collateralBook={collateralBook}
            />
            <CollateralTabRightPane
                account={account}
                collateralBook={collateralBook}
            />
            <DepositCollateral
                isOpen={openModal === 'deposit'}
                onClose={() => setOpenModal('')}
                collateralList={depositCollateralList}
            ></DepositCollateral>
            <WithdrawCollateral
                isOpen={openModal === 'withdraw'}
                onClose={() => setOpenModal('')}
                collateralList={withdrawCollateralList}
            ></WithdrawCollateral>
        </div>
    );
};
