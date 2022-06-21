import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './Separator.stories';

const { Default } = composeStories(stories);

describe('Separator Component', () => {
    it('should render a Separator', () => {
        render(<Default />);
    });
});
