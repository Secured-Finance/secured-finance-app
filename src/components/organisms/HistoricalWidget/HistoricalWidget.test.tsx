import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils.js';
import * as stories from './HistoricalWidget.stories';
const { Default } = composeStories(stories);

describe('HistoricalWidget component', () => {
    it('should render a HistoricalWidget', () => {
        render(<Default />);
    });
});
