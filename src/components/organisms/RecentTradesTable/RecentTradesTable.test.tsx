import { composeStories } from '@storybook/react';
// import { mockRecentTrades } from 'src/stories/mocks/queries';
import { render, screen } from 'src/test-utils.js';
import * as stories from './RecentTradesTable.stories';

const { Default, Empty } = composeStories(stories);

describe('RecentTradesTable component', () => {
    it('should display the Recent Trades Table', () => {
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
        });

        expect(
            screen.getByLabelText('Recent trades table')
        ).toBeInTheDocument();
    });

    it('should display the spinner when loading', () => {
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
        });
        expect(
            screen.getByRole('alertdialog', { name: 'Loading' })
        ).toBeInTheDocument();
    });

    it('should not display the 100 trades notice if there are no entries', () => {
        render(<Empty />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
        });
        expect(
            screen.queryByText('Only the last 100 trades are shown.')
        ).not.toBeInTheDocument();
    });
});
