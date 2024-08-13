import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils.js';
import * as stories from './Checkbox.stories';

const { Default } = composeStories(stories);

describe('Checkbox Component', () => {
    it('should render the default checkbox component', () => {
        render(<Default />);
    });
});
