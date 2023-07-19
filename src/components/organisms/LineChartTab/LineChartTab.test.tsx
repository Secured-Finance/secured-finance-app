import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils.js';
import * as stories from './LineChartTab.stories';

const { Default } = composeStories(stories);

describe('LineChartTab Component', () => {
    it('should render LineChartTab', () => {
        render(<Default />);
    });
});
