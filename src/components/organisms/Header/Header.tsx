import { NavLink, useRouteMatch, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { ReactComponent as SFLogo } from 'src/assets/img/logo.svg';
import { Button } from 'src/components/atoms';
import { NavTab } from 'src/components/atoms/NavTab';

export const Header = (): JSX.Element => {
    return (
        <div
            data-cy='header'
            className='flex h-20 w-full flex-row justify-between border-b border-neutral1'
        >
            <NavLink
                className='ml-5 mt-5 flex h-10 items-center justify-center'
                to='/'
            >
                <SFLogo />
            </NavLink>
            <div className='flex items-center justify-center'>
                <ItemLink text='OTC Lending' link='/' active />
                <ItemLink text='Market Dashboard' link='/exchange' />
                <ItemLink text='Portfolio Management' link='/history/' />
            </div>
            <div className='mr-5 mt-5'>
                <Button>Connect Wallet</Button>
            </div>
        </div>
    );
};

const ItemLink = ({
    text,
    link,
    active,
}: {
    text: string;
    link: string;
    active?: boolean;
}) => {
    return (
        <NavLink exact data-cy={text.toLowerCase()} to={link}>
            <NavTab text={text} active={active} />
        </NavLink>
    );
};
