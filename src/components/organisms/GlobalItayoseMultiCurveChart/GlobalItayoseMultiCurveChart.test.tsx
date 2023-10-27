import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils.js';
import * as stories from './GlobalItayoseMultiCurveChart.stories';

const { Default } = composeStories(stories);

describe('MultiCurveChart Component', () => {
    it('should render  GlobalItayoseMultiCurveChart', () => {
        render(<Default />);
    });
});
