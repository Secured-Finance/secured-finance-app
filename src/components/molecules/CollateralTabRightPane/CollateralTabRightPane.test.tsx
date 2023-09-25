import { composeStories } from '@storybook/react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CollateralTabRightPane.stories';

const { Default, NotConnectedToWallet } = composeStories(stories);

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('CollateralTabRightPane component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render CollateralTabRightPane', () => {
        render(<NotConnectedToWallet />);
        expect(
            screen.getByTestId('collateral-progress-bar')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('liquidation-progress-bar')
        ).toBeInTheDocument();
        expect(screen.getByText('Collateral Utilization')).toBeInTheDocument();
        expect(screen.getByText('Liquidation Risk')).toBeInTheDocument();
    });

    it('should render the progress bars with appropriate values', () => {
        render(<Default />);

        expect(screen.getByText('Collateral Utilization')).toBeInTheDocument();
        expect(screen.getByText('$5,203.15')).toBeInTheDocument();
        expect(screen.getByText('of $9,680.27 available')).toBeInTheDocument();
        expect(screen.getByText('37%')).toBeInTheDocument();
        expect(screen.getByText('Liquidation Risk')).toBeInTheDocument();
        expect(screen.getByText('Low')).toBeInTheDocument();
        expect(screen.getByText('43%')).toBeInTheDocument();
    });
});
