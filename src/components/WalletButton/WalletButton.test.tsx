import { MemoryRouter } from 'react-router-dom';
import { Router } from 'react-router';
import { render, screen } from 'src/test-utils.js';
import { WalletButton } from './WalletButton';

describe('Wallet Button component', () => {
    beforeEach(() => {
        localStorage.removeItem('CACHED_PROVIDER_KEY');
    });

    it('Should render the Unlock Wallet button when not connected', () => {
        render(<WalletButton />);
        expect(screen.getByText('Unlock Wallet')).toBeInTheDocument();
    });
    it('Should render the a link to My Wallet when connected', () => {
        localStorage.setItem('CACHED_PROVIDER_KEY', 'connected');

        render(
            <MemoryRouter>
                <WalletButton />
            </MemoryRouter>
        );
        expect(screen.getByText('My Wallet')).toBeInTheDocument();
    });
});
