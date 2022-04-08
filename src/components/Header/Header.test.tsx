import { MemoryRouter } from 'react-router-dom';
import { Router } from 'react-router-dom';
import { render, screen } from 'src/test-utils.js';
import { Header } from './Header';

describe('Header component', () => {
    it('Should render the header', () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );
        expect(screen.getByText('Secured')).toBeInTheDocument();
        expect(screen.getByText('Finance')).toBeInTheDocument();
        expect(screen.getByText('Lending')).toBeInTheDocument();
        expect(screen.getByText('Terminal')).toBeInTheDocument();
        expect(screen.getByText('History')).toBeInTheDocument();
        expect(screen.getByText('Unlock Wallet')).toBeInTheDocument();
    });
});
