import { composeStories } from '@storybook/testing-react';
import {
    preloadedAssetPrices,
    preloadedBalances,
} from 'src/stories/mocks/fixtures';
import { render, waitFor } from 'src/test-utils.js';
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

describe('MarketDashboard Component', () => {
    it('should render MarketDashboard', async () => {
        waitFor(() =>
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState: {
                    ...preloadedBalances,
                    ...preloadedAssetPrices,
                },
            })
        );
    });
});
