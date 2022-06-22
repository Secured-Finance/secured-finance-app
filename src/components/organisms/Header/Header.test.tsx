import { MemoryRouter } from 'react-router-dom';
import { render, screen } from 'src/test-utils.js';
import { Header } from './Header';

describe('Header component', () => {
    it('Should render the header', () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );
        expect(screen.getByText('OTC Lending')).toBeInTheDocument();
        expect(screen.getByText('Market Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Portfolio Management')).toBeInTheDocument();
        expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    });
});
