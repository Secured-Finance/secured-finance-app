import React from 'react';
import { NavLink } from 'react-router-dom';
import { Logo } from 'src/components/new/icons';
import cm from './Header.module.scss';
import { WalletButton } from './WalletButton';

export const Header: React.FC = () => {
    return (
        <div className='border-b-8 border-solid border-b-strokeGrey'>
            <div className='m-auto flex items-center justify-between pt-0 pb-0 pl-20 pr-20'>
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
        </div>
    );
};
