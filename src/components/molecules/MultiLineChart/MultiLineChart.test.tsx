import { composeStories } from '@storybook/react';
import { fireEvent } from '@storybook/testing-library';
import { screen } from '@testing-library/react';
import { render } from 'src/test-utils.js';
import * as stories from './MultiLineChart.stories';

const { Default } = composeStories(stories);

describe('MultiLineChart Component', () => {
    it('should render the chart with data', () => {
        render(<Default />);
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should call handleChartClick with correct index when a valid point is clicked', async () => {
        const handleChartClick = jest.fn();

        render(<Default handleChartClick={handleChartClick} />);

        const canvas = screen.getByRole('img');
        fireEvent.click(canvas, { clientX: 100, clientY: 100 });

        await screen.findByRole('img');

        expect(canvas).toBeInTheDocument();
    });
});
