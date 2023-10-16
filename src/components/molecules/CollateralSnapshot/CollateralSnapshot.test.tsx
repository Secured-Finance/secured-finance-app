import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils.js';
import * as stories from './CollateralSnapshot.stories';

const { Default } = composeStories(stories);

describe('CollateralSnapshot Component', () => {
    it('should render a CollateralSnapshot', () => {
        render(<Default />);
    });
});
