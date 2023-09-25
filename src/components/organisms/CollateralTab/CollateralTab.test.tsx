import { composeStories } from '@storybook/react';
import { preloadedEthBalance } from 'src/stories/mocks/fixtures';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CollateralTab.stories';

const { Default } = composeStories(stories);

describe('CollateralTab Component', () => {
    it('should render CollateralTab', () => {
        render(<Default />, { preloadedState: preloadedEthBalance });
        expect(screen.getByText('Collateral Balance')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Connect your wallet to see your deposited collateral balance.'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('collateral-tab-right-pane')
        ).toBeInTheDocument();
    });
});
