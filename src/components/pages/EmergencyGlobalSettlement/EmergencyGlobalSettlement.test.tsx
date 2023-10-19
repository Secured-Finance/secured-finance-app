import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils.js';
import * as stories from './EmergencyGlobalSettlement.stories';

const { Default } = composeStories(stories);

jest.mock('next/router', () => ({
    useRouter: jest.fn(() => ({
        pathname: '/',
        push: jest.fn(),
    })),
}));

describe('EmergencyGlobalSettlement Component', () => {
    it('should render a EmergencyGlobalSettlement', () => {
        render(<Default />);
    });
});
