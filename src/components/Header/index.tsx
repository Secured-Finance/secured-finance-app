import cm from './Header.module.scss';
import { Logo } from 'src/components/new/icons';
import { NavLink } from 'react-router-dom';
import React from 'react';
import { WalletButton } from './WalletButton';

export const Header: React.FC = () => {
    return (
        <div className={cm.header}>
            <NavLink className={cm.logo} to={'/'}>
                <Logo fill={'#666cf3'} size={40} />
                <span className={cm.logoText}>
                    <span className={cm.logoTextBold}>Secured</span>&ensp;
                    <span>Finance</span>
                </span>
            </NavLink>
            <div className={cm.navigation}>
                <NavLink
                    exact
                    className={cm.navLink}
                    activeClassName={cm.active}
                    to='/'
                >
                    Lending
                </NavLink>
                <NavLink
                    exact
                    className={cm.navLink}
                    activeClassName={cm.active}
                    to='/exchange'
                >
                    Terminal
                </NavLink>
                <NavLink
                    exact
                    className={cm.navLink}
                    activeClassName={cm.active}
                    to='/history'
                >
                    History
                </NavLink>
                <WalletButton />
            </div>
            <div className={cm.themeSwitch} />
        </div>
    );
};
