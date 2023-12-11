import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils.js';
import * as stories from './RadioButton.stories';
const { Default } = composeStories(stories);

describe('RadioButton component', () => {
    it('should render a RadioButton', () => {
        render(<Default />);
    });
});
