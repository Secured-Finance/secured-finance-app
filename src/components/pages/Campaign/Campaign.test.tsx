import { composeStories } from '@storybook/react';
import { render, cleanupGraphQLMocks } from 'src/test-utils.js';
import graphqlMocks from 'src/test-utils/mockData';
import * as stories from './Campaign.stories';

const { Default } = composeStories(stories);

jest.mock('next/router', () => ({
    useRouter: jest.fn(() => ({
        pathname: '/',
        push: jest.fn(),
    })),
}));

describe('Campaign Component', () => {
    afterEach(() => {
        cleanupGraphQLMocks();
    });

    it('should render the Campaign', async () => {
        render(<Default />, {
            graphqlMocks: graphqlMocks.withTransactions,
        });
    });
});
