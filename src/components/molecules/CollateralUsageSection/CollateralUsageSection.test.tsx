import { composeStories } from '@storybook/react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { render, screen } from 'src/test-utils.js';
import { CurrencySymbol } from 'src/utils';
import * as stories from './CollateralUsageSection.stories';

const { Default } = composeStories(stories);

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('CollateralUsageSection Component', () => {
    it('should render a CollateralUsageSection', () => {
        render(<Default />);
    });

    it('should display the collateral usage from the prop', () => {
        render(<Default collateralCoverage={5000} />);
        expect(screen.getByText('Collateral Usage')).toBeInTheDocument();
        expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('should compute the available to borrow from the collateral', async () => {
        render(<Default />);

        expect(screen.getByText('Available to borrow')).toBeInTheDocument();
        const available = await screen.findByText('867.19 WFIL');
        expect(available).toBeInTheDocument();
    });

    it('should compute the available to borrow in the selected currency', async () => {
        render(
            <Default
                currency={CurrencySymbol.USDC}
                availableToBorrow={BigInt('5203154000')}
            />
        );

        expect(screen.getByText('Available to borrow')).toBeInTheDocument();
        const available = await screen.findByText('5,203.15 USDC');
        expect(available).toBeInTheDocument();
    });

    it('should render correct color on collateral usage', () => {
        render(<Default collateralCoverage={0} />);
        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.getByText('0%')).toHaveClass('text-secondary-500');

        render(<Default collateralCoverage={1000} />);
        expect(screen.getByText('10%')).toBeInTheDocument();
        expect(screen.getByText('10%')).toHaveClass('text-secondary-500');

        render(<Default collateralCoverage={5000} />);
        expect(screen.getByText('50%')).toBeInTheDocument();
        expect(screen.getByText('50%')).toHaveClass('text-warning-500');

        render(<Default collateralCoverage={9000} />);
        expect(screen.getByText('90%')).toBeInTheDocument();
        expect(screen.getByText('90%')).toHaveClass('text-error-500');
    });
});
