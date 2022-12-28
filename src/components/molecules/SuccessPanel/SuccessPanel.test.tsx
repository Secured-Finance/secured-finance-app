import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './SuccessPanel.stories';

const { Default } = composeStories(stories);

describe('SuccessPanel Component', () => {
    it('should render a SuccessPanel', () => {
        render(<Default />);
    });
});
