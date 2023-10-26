import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils.js';
import * as stories from './GlobalItayose.stories';

const { Default } = composeStories(stories);

jest.mock('next/router', () => ({
    useRouter: jest.fn(() => ({
        pathname: '/',
        push: jest.fn(),
    })),
}));

describe('GlobalItayose Component', () => {
    it('should render a GlobalItayose', () => {
        render(<Default />);
    });
});
