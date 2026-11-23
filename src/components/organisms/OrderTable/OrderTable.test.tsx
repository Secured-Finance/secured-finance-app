import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './OrderTable.stories';

const { Default } = composeStories(stories);

describe('OrderTable Component', () => {
    it('should display one line by order', () => {
        render(<Default />);
        const rows = screen.getAllByTestId('open-order-table-row');
        expect(rows).toHaveLength(17);
        expect(rows[0]).toHaveTextContent('WFIL-DEC2023');
        expect(rows[0]).toHaveTextContent('98.00');
        expect(rows[0]).toHaveTextContent('1.02');

        expect(rows[15]).toHaveTextContent('WFIL-DEC2023');
        expect(rows[15]).toHaveTextContent('98.00');
        expect(rows[15]).toHaveTextContent('2.04');

        expect(rows[16]).toHaveTextContent('WFIL-MAR2024');
        expect(rows[16]).toHaveTextContent('96.00');
        expect(rows[16]).toHaveTextContent('4.16');
    });
});
