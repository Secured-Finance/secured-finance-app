import { composeStories } from '@storybook/testing-react';
import { BigNumber } from 'ethers';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
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
    });

    it('should call setCollateral amount with the correct amount when percentage button is clicked', () => {
        const setAmount = jest.fn();
        render(<Default setAmount={setAmount} />);
        const tab = screen.getByTestId(50);
        fireEvent.click(tab);
        expect(setAmount).toBeCalledWith(5);
    });

    it('should call onAmountChange when percentage button is clicked', () => {
        const onChange = jest.fn();
        render(<Default onAmountChange={onChange} />);
        const tab = screen.getByTestId(50);
        fireEvent.click(tab);
        expect(onChange).toHaveBeenCalledWith(
            BigNumber.from('5000000000000000000')
        );
    });
    it('should change fontsize according to length of input', async () => {
        render(<Default />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('text-3xl');

        fireEvent.input(input, { target: { value: '123456789' } });
        expect(input).toHaveClass('text-3xl');
        waitFor(() => {
            fireEvent.input(input, { target: { value: '123456789.1234' } });
            expect(input).toHaveClass('text-2xl');
        });
        fireEvent.input(input, { target: { value: '12345' } });
        expect(input).toHaveClass('text-3xl');
    });
});
