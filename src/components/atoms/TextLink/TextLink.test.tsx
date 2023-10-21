import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils.js';
import * as stories from './TextLink.stories';

const { Default } = composeStories(stories);

describe('TextLink Component', () => {
    it('should render a TextLink', () => {
        render(<Default />);
    });
});
