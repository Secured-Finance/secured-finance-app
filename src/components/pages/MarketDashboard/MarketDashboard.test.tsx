import { composeStories } from '@storybook/testing-react';
import {
    preloadedAssetPrices,
    preloadedBalances,
} from 'src/stories/mocks/fixtures';
import { render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './MarketDashboard.stories';

const { Default } = composeStories(stories);

jest.mock('next/router', () => ({
    useRouter: jest.fn(() => ({
        pathname: '/',
        push: jest.fn(),
    })),
}));

jest.mock(
    'next/link',
    () =>
        ({ children }: { children: React.ReactNode }) =>
            children
);

const renderDefault = async () => {
    await waitFor(() =>
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
            preloadedState: {
                ...preloadedBalances,
                ...preloadedAssetPrices,
            },
        })
    );
};

describe('MarketDashboard Component', () => {
    it('should render MarketDashboard', async () => {
        await renderDefault();
    });

    it('should render the total users', async () => {
        await renderDefault();
        const totalUsers = await screen.findByText('12.15K');
        expect(totalUsers).toBeInTheDocument();
    });

    it('should show the yield curves', async () => {
        await renderDefault();
        const yieldCurves = await screen.findAllByTestId('curve-chip');
        expect(yieldCurves).toHaveLength(4);
    });
});
