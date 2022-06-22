import { MemoryRouter } from 'react-router-dom';
import { render, screen } from 'src/test-utils.js';
import { UseWalletProvider } from 'use-wallet';
import { Header } from './Header';

describe('Header component', () => {
    it('Should render the header', () => {
        render(
            <UseWalletProvider>
                <MemoryRouter>
                    <Header />
                </MemoryRouter>
            </UseWalletProvider>
        );
        expect(screen.getByText('OTC Lending')).toBeInTheDocument();
        expect(screen.getByText('Market Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Portfolio Management')).toBeInTheDocument();
        expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    });
});
