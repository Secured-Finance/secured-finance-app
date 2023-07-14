import { composeStories } from '@storybook/react';
import { preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './AssetInformation.stories';

const { Default, ZeroUsdcCollateral } = composeStories(stories);

describe('test AssetInformation component', () => {
    it('should render AssetInformation', () => {
        const preloadedState = { ...preloadedAssetPrices };
        render(<Default />, { preloadedState });
        expect(screen.getByText('Collateral Assets')).toBeInTheDocument();
        expect(screen.getByText('ETH')).toBeInTheDocument();
        expect(screen.getByText('$2,000.34')).toBeInTheDocument();
        expect(screen.getByText('1.200')).toBeInTheDocument();
        expect(screen.getByText('$2,400.41')).toBeInTheDocument();

        expect(screen.getByText('USDC')).toBeInTheDocument();
        expect(screen.getByText('$1.00')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('$10.00')).toBeInTheDocument();
    });

    it('should display the information popover on mouse enter', () => {
        render(<Default />);
        const information = screen.getByTestId('information-circle');
        fireEvent.mouseEnter(information);
        const tooltip = screen.getByTestId('tooltip');
        expect(tooltip).toHaveTextContent(
            'Only USDC and ETH are eligible as collateral.'
        );
    });

    it('should not render currencies with zero collateral', () => {
        const preloadedState = { ...preloadedAssetPrices };
        render(<ZeroUsdcCollateral />, { preloadedState });
        expect(screen.getByText('Collateral Assets')).toBeInTheDocument();
        expect(screen.getByText('ETH')).toBeInTheDocument();
        expect(screen.getByText('$2,000.34')).toBeInTheDocument();
        expect(screen.getByText('1.200')).toBeInTheDocument();
        expect(screen.getByText('$2,400.41')).toBeInTheDocument();

        expect(screen.queryByText('USDC')).not.toBeInTheDocument();
        expect(screen.queryByText('$1')).not.toBeInTheDocument();
        expect(screen.queryByText('10 USDC')).not.toBeInTheDocument();
        expect(screen.queryByText('$10')).not.toBeInTheDocument();
    });
});
