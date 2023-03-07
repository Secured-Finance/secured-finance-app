import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './UnwindDialog.stories';

const { Default } = composeStories(stories);

describe('UnwindDialog Component', () => {
    it('should render a UnwindDialog', () => {
        render(<Default />);
    });
});
