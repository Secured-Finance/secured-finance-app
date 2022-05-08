import React, { useCallback } from 'react';
import Chip from 'src/components/atoms/Chip/Chip';
import {
    CollateralModal,
    SendModal,
    WalletAccountModal,
    WalletProviderModal,
} from 'src/components/organisms';
import useModal from 'src/hooks/useModal';
import { supportedCoins } from 'src/store/wallets/types';

interface ActionProps {
    callbackMap?: {
        send?: () => void;
        signOut?: () => void;
        placeCollateral?: () => void;
    };
    ccyIndex: number;
}

const RenderActions: React.FC<ActionProps> = ({ callbackMap, ccyIndex }) => {
    const [onPresentSettingsModal] = useModal(
        <WalletAccountModal ccyIndex={ccyIndex} />
    );
    const [onPresentSendModal] = useModal(<SendModal ccyIndex={ccyIndex} />);
    const [onPresentCollateralModal] = useModal(
        <CollateralModal ccyIndex={ccyIndex} />
    );

    const [onPresentWalletEthProviderModal] = useModal(
        <WalletProviderModal ccyIndex={ccyIndex} />,
        'provider'
    );

    const handleConnectWallet = useCallback(() => {
        onPresentWalletEthProviderModal();
    }, [onPresentWalletEthProviderModal]);

    const coin = supportedCoins[ccyIndex];

    return (
        <div>
            {callbackMap?.send &&
            callbackMap?.placeCollateral &&
            callbackMap?.signOut ? (
                <div className='flex flex-row items-center justify-evenly'>
                    <Chip
                        onClick={onPresentSendModal}
                        text='Send'
                        dataCy={`${coin}-send-chip`}
                    />
                    {ccyIndex === 0 ? (
                        <Chip
                            onClick={onPresentCollateralModal}
                            text='Manage Collateral'
                        />
                    ) : null}
                    <Chip
                        onClick={onPresentSettingsModal}
                        text='Settings'
                        dataCy={`${coin}-settings-chip`}
                    />
                </div>
            ) : (
                <div className='flex flex-row items-center justify-evenly'>
                    <Chip
                        onClick={handleConnectWallet}
                        text='Connect Wallet'
                        dataCy={`${coin}-connect-wallet-chip`}
                    />
                </div>
            )}
        </div>
    );
};

export default RenderActions;
