import { composeStories } from '@storybook/react';
import { screen } from '@testing-library/react';
import { render } from 'src/test-utils.js';
import * as stories from './MultiLineChart.stories';

const { Default } = composeStories(stories);

describe('MultiLineChart Component', () => {
    it('should render the chart with data', () => {
        render(<Default />);
        expect(screen.getByRole('img')).toBeInTheDocument();
    });
});
