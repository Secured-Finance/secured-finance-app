import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './OpenOrderTable.stories';

const { Default } = composeStories(stories);

describe('OpenOrderTable Component', () => {
    it('should render a OpenOrderTable', () => {
        render(<Default />);
    });

    it('should only display the open orders', () => {
        render(<Default />);
        expect(screen.getAllByTestId('open-order-table-row')).toHaveLength(1);
    });
});
