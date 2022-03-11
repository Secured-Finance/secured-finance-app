import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { render, screen } from 'src/test-utils.js';
import { Header } from './Header';

describe('Header component', () => {
    it('Should render the header', () => {
        const history = createMemoryHistory();
        render(
            <Router history={history}>
                <Header />
            </Router>
        );
        expect(screen.getByText('Secured')).toBeInTheDocument();
        expect(screen.getByText('Finance')).toBeInTheDocument();
        expect(screen.getByText('Lending')).toBeInTheDocument();
        expect(screen.getByText('Terminal')).toBeInTheDocument();
        expect(screen.getByText('History')).toBeInTheDocument();
        expect(screen.getByText('Unlock Wallet')).toBeInTheDocument();
    });
});
