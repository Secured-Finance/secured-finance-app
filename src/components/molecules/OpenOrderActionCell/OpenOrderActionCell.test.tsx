import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './OpenOrderActionCell.stories';

const { Default } = composeStories(stories);

describe('OpenOrderActionCell Component', () => {
    it('should render a OpenOrderActionCell', () => {
        render(<Default />);
    });
});
