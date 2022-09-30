import { MockedProvider } from '@apollo/client/testing';
import { composeStories } from '@storybook/testing-react';
import { render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './PortfolioManagement.stories';

const { Default, ConnectedToWallet } = composeStories(stories);

describe('PortfolioManagement component', () => {
    it('should render PortfolioManagement', async () => {
        await waitFor(() =>
            render(
                <MockedProvider
                    mocks={Default.parameters?.apolloClient.mocks as never}
                >
                    <Default />
                </MockedProvider>
            )
        );
    });

    it('should render PortfolioManagement when connected to wallet with two active trades and a header row', async () => {
        await waitFor(() =>
            render(
                <MockedProvider
                    mocks={
                        ConnectedToWallet.parameters?.apolloClient
                            .mocks as never
                    }
                >
                    <ConnectedToWallet />
                </MockedProvider>
            )
        );
        expect(screen.getAllByRole('row')).toHaveLength(4);
        expect(screen.getAllByTestId('active-trade-row')).toHaveLength(3);
    });
});
