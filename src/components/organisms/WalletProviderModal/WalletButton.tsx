import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { ArrowIcon } from 'src/components/new/icons';
import WalletProviderModal from 'src/components/organisms/WalletProviderModal/WalletProviderModal';
import { CACHED_PROVIDER_KEY } from 'src/contexts/FilecoinWalletProvider';
import useModal from 'src/hooks/useModal';
import { isAnyWalletConnected } from 'src/store/wallets/selectors';

export const WalletButton = () => {
    const isAccountConnected = localStorage.getItem(CACHED_PROVIDER_KEY);
    const hasAnyWalletConnection = useSelector(isAnyWalletConnected);
    const [onPresentWalletProviderModal] = useModal(
        <WalletProviderModal ccyIndex={0} />,
        'provider'
    );
    const handleUnlockClick = useCallback(() => {
        onPresentWalletProviderModal();
    }, [onPresentWalletProviderModal]);

    return isAccountConnected || hasAnyWalletConnection ? (
        <NavLink exact to='/account'>
            My Wallet
        </NavLink>
    ) : (
        <div role='button' onClick={handleUnlockClick} className='flex'>
            <span className='mr-2'>Unlock Wallet</span>
            <ArrowIcon fill={'#666cf3'} direction={'right'} />
        </div>
    );
};
