import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './CoreTable.stories';

const { Default, WithHiddenColumn } = composeStories(stories);

describe('CoreTable Component', () => {
    it('should render a CoreTable', () => {
        render(<Default />);
    });

    it('should render a CoreTable with 2 rows and a header row', () => {
        render(<Default />);
        expect(screen.getAllByRole('row').length).toBe(3);
        expect(screen.getAllByTestId('core-table-row').length).toBe(2);
        expect(screen.getAllByTestId('core-table-header').length).toBe(1);
    });

    it('should have the row clickable if hoverRow returns true', () => {
        render(<Default options={{ hoverRow: () => true }} />);
        screen.getAllByTestId('core-table-row').forEach(row => {
            expect(row).toHaveClass('cursor-pointer');
        });
    });

    it('should have the row not clickable if hoverRow returns false', () => {
        render(<Default options={{ hoverRow: () => false }} />);
        screen.getAllByTestId('core-table-row').forEach(row => {
            expect(row).not.toHaveClass('cursor-pointer');
        });
    });

    it('should have borders  for each row if border is true', () => {
        render(<Default options={{ border: true }} />);
        screen.getAllByTestId('core-table-row').forEach(row => {
            expect(row).toHaveClass('border-b border-white-10');
        });
    });

    it('should call onLineClick when a row is clicked and row is clickable', () => {
        const onLineClick = jest.fn();
        render(<Default options={{ onLineClick, hoverRow: () => true }} />);
        const row = screen.getAllByTestId('core-table-row')[0];
        fireEvent.click(row);
        expect(onLineClick).toBeCalledWith('0');
    });

    it('should not call onLineClick when an empty row is clicked', () => {
        const onLineClick = jest.fn();
        render(<Default options={{ onLineClick, hoverRow: () => false }} />);
        const row = screen.getAllByTestId('core-table-row')[0];
        fireEvent.click(row);
        expect(onLineClick).not.toBeCalled();
    });

    it('should hide a column if we pass a column id in the hiddenColumns prop', () => {
        render(<WithHiddenColumn />);
        const header = screen.getAllByTestId('core-table-header')[0];
        expect(header).not.toHaveTextContent('age');
        expect(header).toHaveTextContent('name');
    });

    it('should have a sticky column if responsive is true', () => {
        render(<Default options={{ responsive: true }} />);
        const header = screen.getAllByTestId('core-table-header-cell')[0];
        expect(header).toHaveClass('sticky');
    });
});
