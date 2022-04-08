import { NavLink } from 'react-router-dom';
import { Logo } from 'src/components/new/icons';
import { WalletButton } from '../WalletButton/WalletButton';

export const Header = (): JSX.Element => {
    return (
        <div className='border-b-2 border-solid border-strokeGrey'>
            <div className='m-auto flex justify-between py-3'>
                <NavLink
                    className='flex w-2/5 cursor-pointer items-center border-r-2 border-solid border-strokeGrey pl-12'
                    to='/'
                >
                    <Logo fill={'#666cf3'} size={40} />
                    <span className='ml-4 text-purple'>
                        <span className='font-bold'>Secured</span>&ensp;
                        <span>Finance</span>
                    </span>
                </NavLink>
                <div className='flex flex-grow items-center justify-start space-x-8 border-l-2 border-solid pl-4'>
                    <ItemLink text='Lending' link='/' />
                    <ItemLink text='Terminal' link='/exchange' />
                    <ItemLink text='History' link='/history' />
                    <div className='flex text-purple'>
                        <WalletButton />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ItemLink = ({ text, link }: { text: string; link: string }) => {
    return (
        <NavLink
            exact
            className='flex cursor-pointer text-lightGrey'
            activeClassName='text-lightSilver'
            to={link}
        >
            {text}
        </NavLink>
    );
};
