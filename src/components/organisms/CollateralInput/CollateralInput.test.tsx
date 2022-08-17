import { composeStories } from '@storybook/testing-react';
import { BigNumber } from 'ethers';
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
    });

    it('should update collateral amount when percentage button is clicked', () => {
        render(<Default />);
        const tab = screen.getByTestId(50);
        fireEvent.click(tab);
        expect(screen.getByRole('textbox').getAttribute('value')).toBe('5');
        expect(screen.getByText('$500.00')).toBeInTheDocument();
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
});
