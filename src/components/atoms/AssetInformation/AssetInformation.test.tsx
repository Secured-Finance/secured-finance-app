import { composeStories } from '@storybook/testing-react';
import { preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { render, screen } from 'src/test-utils.js';
import * as stories from './AssetInformation.stories';

const { Default, ZeroUsdcCollateral } = composeStories(stories);

describe('test AssetInformation component', () => {
    it('should render AssetInformation', () => {
        const preloadedState = { ...preloadedAssetPrices };
        render(<Default />, { preloadedState });
        expect(screen.getByText('Collateral Assets')).toBeInTheDocument();
        expect(screen.getByText('ETH')).toBeInTheDocument();
        expect(screen.getByText('$2,000.34 USD')).toBeInTheDocument();
        expect(screen.getByText('1.2 ETH')).toBeInTheDocument();
        expect(screen.getByText('$2,400.41 USD')).toBeInTheDocument();

        expect(screen.getByText('USDC')).toBeInTheDocument();
        expect(screen.getByText('$1.00 USD')).toBeInTheDocument();
        expect(screen.getByText('10 USDC')).toBeInTheDocument();
        expect(screen.getByText('$10.00 USD')).toBeInTheDocument();
    });

    it('should not render currencies with zero collateral', () => {
        const preloadedState = { ...preloadedAssetPrices };
        render(<ZeroUsdcCollateral />, { preloadedState });
        expect(screen.getByText('Collateral Assets')).toBeInTheDocument();
        expect(screen.getByText('ETH')).toBeInTheDocument();
        expect(screen.getByText('$2,000.34 USD')).toBeInTheDocument();
        expect(screen.getByText('1.2 ETH')).toBeInTheDocument();
        expect(screen.getByText('$2,400.41 USD')).toBeInTheDocument();

        expect(screen.queryByText('USDC')).not.toBeInTheDocument();
        expect(screen.queryByText('$1.00 USD')).not.toBeInTheDocument();
        expect(screen.queryByText('10 USDC')).not.toBeInTheDocument();
        expect(screen.queryByText('$10.00 USD')).not.toBeInTheDocument();
    });
});
