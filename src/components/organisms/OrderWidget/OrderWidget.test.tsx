import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './OrderWidget.stories';

const { Default } = composeStories(stories);

describe('OrderWidget Component', () => {
    it('should render a OrderWidget', () => {
        render(<Default />);
    });
});
