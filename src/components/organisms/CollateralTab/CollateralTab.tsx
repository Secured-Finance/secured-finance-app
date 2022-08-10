import { useState } from 'react';
import { CollateralTabLeftPane, Tab } from 'src/components/molecules';
import { useCollateralBook } from 'src/hooks/useCollateralBook';
import { getFullDisplayBalanceNumber } from 'src/utils';
import { useWallet } from 'use-wallet';
import { DepositCollateral } from '../DepositCollateral';

export const CollateralTab = () => {
    const { account } = useWallet();
    const colBook = useCollateralBook(account ? account : '');
    const [openModal, setOpenModal] = useState('');

    return (
        <div className='h-full w-full'>
            <Tab>
                {(() => {
                    return (
                        <div>
                            <CollateralTabLeftPane
                                onClick={step => setOpenModal(step)}
                                account={account}
                                balance={
                                    account
                                        ? getFullDisplayBalanceNumber(
                                              colBook.usdCollateral.toNumber()
                                          )
                                        : 0
                                }
                            />
                            <DepositCollateral
                                isOpen={openModal === 'deposit'}
                                onClose={() => setOpenModal('')}
                            ></DepositCollateral>
                            <DepositCollateral
                                isOpen={openModal === 'withdraw'}
                                onClose={() => setOpenModal('')}
                            ></DepositCollateral>
                        </div>
                    );
                })()}
            </Tab>
        </div>
    );
};
