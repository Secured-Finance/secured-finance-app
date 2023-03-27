import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './CoreTable.stories';

const { Default } = composeStories(stories);

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
        render(<Default hoverRow={() => true} />);
        screen.getAllByTestId('core-table-row').forEach(row => {
            expect(row).toHaveClass('cursor-pointer');
        });
    });

    it('should have the row not clickable if hoverRow returns false', () => {
        render(<Default hoverRow={() => false} />);
        screen.getAllByTestId('core-table-row').forEach(row => {
            expect(row).not.toHaveClass('cursor-pointer');
        });
    });

    it('should have borders  for each row if border is true', () => {
        render(<Default border />);
        screen.getAllByTestId('core-table-row').forEach(row => {
            expect(row).toHaveClass('border-b border-white-10');
        });
    });

    it('should call onLineClick when a row is clicked and row is clickable', () => {
        const onLineClick = jest.fn();
        render(<Default onLineClick={onLineClick} hoverRow={() => true} />);
        const row = screen.getAllByTestId('core-table-row')[0];
        fireEvent.click(row);
        expect(onLineClick).toBeCalledWith('0');
    });
});
