import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './CollateralInput.stories';

const { Default } = composeStories(stories);

describe('CollateralInput component', () => {
    it('should render Collateral Input', () => {
        render(<Default />);
        expect(screen.getByText('Amount')).toBeInTheDocument();
        expect(screen.getAllByRole('button')).toHaveLength(4);
        expect(screen.getByRole('textbox').getAttribute('placeholder')).toBe(
            '0'
        );
        expect(screen.getByRole('textbox').getAttribute('value')).toBe('');
    });

    it('should update collateral amount when percentage button is clicked', () => {
        render(<Default />);
        const tab = screen.getByTestId(50);
        fireEvent.click(tab);
        expect(screen.getByRole('textbox').getAttribute('value')).toBe('5');
        expect(screen.getByText('$500.00')).toBeInTheDocument();
    });

    it.skip('should change fontsize according to length of input', async () => {
        render(<Default />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('text-3xl');

        fireEvent.input(input, { target: { value: '123456789' } });
        expect(input).toHaveClass('text-3xl');
        // await waitFor(() => {
        //     fireEvent.input(input, { target: { value: '123456789.1234' } });
        //     expect(input).toHaveClass('text-2xl');
        // });
        fireEvent.input(input, { target: { value: '12345' } });
        expect(input).toHaveClass('text-3xl');
    });
});
