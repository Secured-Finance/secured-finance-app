import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils.js';
import * as stories from './InfoToolTip.stories';

const { Default } = composeStories(stories);

describe('InfoToolTip Component', () => {
    it('should render a InfoToolTip', () => {
        render(<Default />);
    });
});
