import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './Spinner.stories';

const { Default } = composeStories(stories);

describe('Spinner Component', () => {
    it('should render a Spinner', () => {
        render(<Default />);
    });
});
