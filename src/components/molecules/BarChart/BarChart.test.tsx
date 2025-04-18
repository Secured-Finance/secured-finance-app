import { composeStories } from '@storybook/react';
import { render, waitFor } from 'src/test-utils.js';
import * as stories from './BarChart.stories';

const { Default, EmptyData } = composeStories(stories);

describe('BarChart Component', () => {
    it('should render BarChart with data', async () => {
        const { container } = render(<Default />);
        await waitFor(() => {
            expect(container.querySelector('canvas')).toBeInTheDocument();
        });
    });

    it('should render BarChart with empty data', async () => {
        const { container } = render(<EmptyData />);
        await waitFor(() => {
            expect(container.querySelector('canvas')).toBeInTheDocument();
        });
    });
});
