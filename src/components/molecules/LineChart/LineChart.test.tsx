import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './LineChart.stories';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

const { Default } = composeStories(stories);

describe('LineChart Component', () => {
    it('should render a LineChart', () => {
        render(<Default />);
        expect(screen.getByText('xyz')).toBeInTheDocument();
    });
});
