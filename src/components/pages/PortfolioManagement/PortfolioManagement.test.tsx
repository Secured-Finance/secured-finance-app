import { composeStories } from '@storybook/react';
import { preloadedEthBalance } from 'src/stories/mocks/fixtures';
import { render, waitFor } from 'src/test-utils.js';
import * as stories from './PortfolioManagement.stories';

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

describe('PortfolioManagement component', () => {
    it('should render PortfolioManagement', async () => {
        waitFor(() =>
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState: preloadedEthBalance,
            })
        );
    });
});
