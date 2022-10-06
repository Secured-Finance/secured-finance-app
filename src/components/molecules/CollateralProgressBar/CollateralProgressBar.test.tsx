import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './CollateralProgressBar.stories';

const { Default } = composeStories(stories);

describe('CollateralProgressBar Component', () => {
    it('should render a CollateralProgressBar', () => {
        render(<Default />);
    });
});
