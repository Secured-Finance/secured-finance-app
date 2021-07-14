import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import cm from './Header.module.scss';
import { ArrowIcon } from 'src/components/new/icons';
import React, { useCallback } from 'react';
import useModal from 'src/hooks/useModal';
import WalletProviderModal from '../WalletProviderModal';
import { CACHED_PROVIDER_KEY } from 'src/contexts/FilecoinWalletProvider';
import { useSelector } from 'react-redux';
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
        <NavLink
            exact
            className={cx(cm.navLink, cm.unlockWalletLink)}
            to='/account'
        >
            My Wallet
        </NavLink>
    ) : (
        <div
            role={'button'}
            onClick={handleUnlockClick}
            className={cx(cm.navLink, cm.unlockWalletLink)}
        >
            <span>Unlock Wallet</span>
            <ArrowIcon fill={'#666cf3'} direction={'right'} />
        </div>
    );
};
