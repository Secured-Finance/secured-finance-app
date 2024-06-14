import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils.js';
import * as stories from './Identicon.stories';

const { Default } = composeStories(stories);

describe('Identicon Component', () => {
    it('should render a svg icon', () => {
        render(<Default />);
    });
});
