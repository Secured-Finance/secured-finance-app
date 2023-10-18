import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils.js';
import * as stories from './DelistingChip.stories';

const { Default } = composeStories(stories);

describe('DelistingChip Component', () => {
    it('should render a DelistingChip', () => {
        render(<Default />);
    });
});
