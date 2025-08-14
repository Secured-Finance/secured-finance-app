import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CollateralTab.stories';

const { Default } = composeStories(stories);

describe('CollateralTab Component', () => {
    it('should render CollateralTab', () => {
        render(<Default />);
        expect(screen.getByText('Net Asset Value')).toBeInTheDocument();
        expect(screen.getByText('$0.00')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Connect your wallet to see your deposited collateral balance.',
            ),
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('collateral-tab-right-pane'),
        ).toBeInTheDocument();
    });
});
