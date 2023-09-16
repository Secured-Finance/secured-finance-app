import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './OrderTable.stories';

const { Default, Compact } = composeStories(stories);

describe('OrderTable Component', () => {
    it('should sort the open orders contract column correctly according to currency and maturity', () => {
        render(<Default />);

        expect(screen.getAllByTestId('open-order-table-row')).toHaveLength(5);

        const initialRows = screen.getAllByRole('row');
        expect(initialRows[1]).toHaveTextContent('WFIL-DEC23');
        expect(initialRows[2]).toHaveTextContent('WFIL-MAR23');
        expect(initialRows[3]).toHaveTextContent('WFIL-DEC22');
        expect(initialRows[4]).toHaveTextContent('WBTC-MAR23');
        expect(initialRows[5]).toHaveTextContent('ETH-DEC23');

        screen.getByText('Contract').click();
        const sortedRowsAsc = screen.getAllByRole('row');
        expect(sortedRowsAsc[1]).toHaveTextContent('ETH-DEC23');
        expect(sortedRowsAsc[2]).toHaveTextContent('WBTC-MAR23');
        expect(sortedRowsAsc[3]).toHaveTextContent('WFIL-DEC22');
        expect(sortedRowsAsc[4]).toHaveTextContent('WFIL-MAR23');
        expect(sortedRowsAsc[5]).toHaveTextContent('WFIL-DEC23');

        screen.getByText('Contract').click();
        const sortedRowsDesc = screen.getAllByRole('row');
        expect(sortedRowsDesc[1]).toHaveTextContent('WFIL-DEC23');
        expect(sortedRowsDesc[2]).toHaveTextContent('WFIL-MAR23');
        expect(sortedRowsDesc[3]).toHaveTextContent('WFIL-DEC22');
        expect(sortedRowsDesc[4]).toHaveTextContent('WBTC-MAR23');
        expect(sortedRowsDesc[5]).toHaveTextContent('ETH-DEC23');
    });

    it('should show a compact table when the compact variant is passed', () => {
        render(<Compact />);
        expect(screen.queryAllByRole('img')).toHaveLength(0);
    });
});
