import { composeStories } from '@storybook/react';
import { render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './PointsDashboard.stories';

const { Default } = composeStories(stories);

jest.mock('next/router', () => ({
    useRouter: jest.fn(() => ({
        pathname: '/',
        push: jest.fn(),
    })),
}));

describe('PointsDashboard Component', () => {
    it('should render the PointsDashboard', async () => {
        await waitFor(() =>
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
            })
        );
        expect(
            screen.getByText('Join the Secured Finance Points Program!')
        ).toBeInTheDocument();
        expect(
            screen.queryAllByRole('button', { name: 'Connect Wallet' })[1]
        ).toBeInTheDocument();
    });
});
