import { useState } from 'react';
import { CollateralTabLeftPane } from 'src/components/molecules';
import { useCollateralBook } from 'src/hooks';
import { useWallet } from 'use-wallet';
import { DepositCollateral } from '../DepositCollateral';
import { WithdrawCollateral } from '../WithdrawCollateral';

export const CollateralTab = () => {
    const { account } = useWallet();
    const collateralBook = useCollateralBook(account);
    const [openModal, setOpenModal] = useState('');

    return (
        <div className='h-[410px] w-full'>
            <CollateralTabLeftPane
                onClick={step => setOpenModal(step)}
                account={account}
                collateralBook={collateralBook}
            />
            <DepositCollateral
                isOpen={openModal === 'deposit'}
                onClose={() => setOpenModal('')}
            ></DepositCollateral>
            <WithdrawCollateral
                isOpen={openModal === 'withdraw'}
                onClose={() => setOpenModal('')}
                collateralBook={collateralBook}
            ></WithdrawCollateral>
        </div>
    );
};
