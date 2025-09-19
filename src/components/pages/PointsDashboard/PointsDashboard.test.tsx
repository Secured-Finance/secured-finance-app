import { composeStories } from '@storybook/react';
import {
    render,
    screen,
    waitFor,
    cleanupGraphQLMocks,
} from 'src/test-utils.js';
import graphqlMocks from 'src/test-utils/mockData';
import * as stories from './PointsDashboard.stories';

const { Default } = composeStories(stories);

jest.mock('next/router', () => ({
    useRouter: jest.fn(() => ({
        pathname: '/',
        push: jest.fn(),
    })),
}));

describe.skip('PointsDashboard Component', () => {
    afterEach(() => {
        cleanupGraphQLMocks();
    });

    it('should render the PointsDashboard', async () => {
        await waitFor(() =>
            render(<Default />, {
                graphqlMocks: graphqlMocks.withTransactions,
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
