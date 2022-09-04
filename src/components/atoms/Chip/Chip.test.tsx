import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './Chip.stories';

const { Default } = composeStories(stories);

describe('Chip Component', () => {
    it('should render a Chip', () => {
        render(<Default />);
    });
});
