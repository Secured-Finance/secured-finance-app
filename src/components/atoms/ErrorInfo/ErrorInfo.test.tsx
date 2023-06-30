import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './ErrorInfo.stories';

const { Default } = composeStories(stories);

describe('Chip Component', () => {
    it('should render an error text', () => {
        render(<Default />);
    });
});
