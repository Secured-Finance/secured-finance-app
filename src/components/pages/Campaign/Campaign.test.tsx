import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils.js';
import * as stories from './Campaign.stories';

const { Default } = composeStories(stories);

jest.mock('next/router', () => ({
    useRouter: jest.fn(() => ({
        pathname: '/',
        push: jest.fn(),
    })),
}));

describe('Campaign Component', () => {
    it('should render the Campaign', async () => {
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
        });
    });
});
