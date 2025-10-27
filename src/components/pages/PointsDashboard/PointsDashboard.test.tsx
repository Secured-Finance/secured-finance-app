import { render, screen } from 'src/test-utils.js';
import { PointsDashboard } from './PointsDashboard';

jest.mock('next/router', () => ({
    useRouter: jest.fn(() => ({
        pathname: '/',
        push: jest.fn(),
    })),
}));

describe('PointsDashboard Component', () => {
    it('should render the PointsDashboard', () => {
        render(<PointsDashboard />);

        expect(
            screen.getByText('Join the Secured Finance Points Program!')
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Connect Wallet' })
        ).toBeInTheDocument();
    });
});
