import { BigNumber } from 'ethers';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    CollateralTabLeftPane,
    CollateralTabRightPane,
} from 'src/components/molecules';
import { CollateralBook } from 'src/hooks';
import { RootState } from 'src/store/types';
import { selectEthereumBalance, selectUSDCBalance } from 'src/store/wallet';
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
    balance: Partial<Record<CurrencySymbol, number | BigNumber>>
): Record<CurrencySymbol, CollateralInfo> => {
    let collateralRecords: Record<string, CollateralInfo> = {};
    for (let i = 0; i < collateralList.length; i++) {
        const currencyInfo = collateralList[i];
        const collateralInfo = {
            [currencyInfo]: {
                symbol: currencyInfo,
                name: currencyInfo,
                available: balance[currencyInfo]
                    ? typeof balance[currencyInfo] === 'number'
                        ? (balance[currencyInfo] as number)
                        : amountFormatterFromBase[currencyInfo](
                              balance[currencyInfo] as BigNumber
                          )
                    : 0,
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

    const ethBalance = useSelector((state: RootState) =>
        selectEthereumBalance(state)
    );

    const usdcBalance = useSelector((state: RootState) =>
        selectUSDCBalance(state)
    );

    const balanceRecord = useMemo(() => {
        return {
            [CurrencySymbol.ETH]: ethBalance,
            [CurrencySymbol.USDC]: usdcBalance,
        };
    }, [ethBalance, usdcBalance]);

    const depositCollateralList = useMemo(
        () => generateCollateralList(balanceRecord),
        [balanceRecord]
    );

    const withdrawCollateralList = useMemo(
        () => generateCollateralList(collateralBook.collateral),
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
