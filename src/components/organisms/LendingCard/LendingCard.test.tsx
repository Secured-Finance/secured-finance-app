import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './LendingCard.stories';

const { Default } = composeStories(stories);

describe('LendingCard Component', () => {
    it('should render a LendingCard', () => {
        render(<Default />);
    });
});
