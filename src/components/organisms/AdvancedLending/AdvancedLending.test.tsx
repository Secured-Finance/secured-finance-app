import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './AdvancedLending.stories';

const { Default } = composeStories(stories);

describe('Advanced Lending Component', () => {
    it('should render advanced lending', () => {
        render(<Default />);
    });
});
