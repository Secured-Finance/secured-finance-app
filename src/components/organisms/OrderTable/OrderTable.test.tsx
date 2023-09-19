import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './OrderTable.stories';

const { Default, Compact } = composeStories(stories);

describe('OrderTable Component', () => {
    it('should display one line by order', () => {
        render(<Default />);
        expect(screen.getAllByTestId('open-order-table-row')).toHaveLength(15);
    });

    it('should show a compact table when the compact variant is passed', () => {
        render(<Compact />);
        expect(screen.queryAllByRole('img')).toHaveLength(0);
    });

    it('should be scrollable when the compact variant is passed', () => {
        render(<Compact />);
        expect(
            screen.getByRole('table').parentElement?.parentElement
                ?.parentElement
        ).toHaveClass('overflow-y-visible');
    });
});
