import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './FailurePanel.stories';

const { Default } = composeStories(stories);

describe('FailurePanel Component', () => {
    it('should render a FailurePanel', () => {
        render(<Default />);
    });
});
