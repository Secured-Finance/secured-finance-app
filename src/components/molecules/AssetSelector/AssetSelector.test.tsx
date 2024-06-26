import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './AssetSelector.stories';

const { Default } = composeStories(stories);

describe('AssetSelector Component', () => {
    it('should render a AssetSelector', () => {
        render(<Default />);
    });

    it('should display the amount in USD when entered a currency', () => {
        render(<Default />);
        const input = screen.getByRole('textbox');
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('ETH'));
        fireEvent.change(input, { target: { value: '1' } });
        expect(screen.getByText(`~ $1,012`)).toBeInTheDocument();
        fireEvent.change(input, { target: { value: '10' } });
        expect(screen.getByText(`~ $10,120`)).toBeInTheDocument();
    });

    it('should call the onAmountChange function when the amount is changed', () => {
        const onAmountChange = jest.fn();
        render(<Default onAmountChange={onAmountChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '1' } });
        expect(onAmountChange).toHaveBeenCalled();
    });

    it('should call onAmountChange function with the amount converted to BigInt if no amountFormatterMap was provided', () => {
        const onAmountChange = jest.fn();
        render(<Default onAmountChange={onAmountChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '1' } });
        expect(onAmountChange).toHaveBeenCalledWith('1');
        fireEvent.change(input, { target: { value: '10' } });
        expect(onAmountChange).toHaveBeenLastCalledWith('10');
    });

    it('should call onAmountChange function with the amount converted to BigInt with the function from amountFormatterMap', () => {
        const onAmountChange = jest.fn();
        render(<Default onAmountChange={onAmountChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '1' } });
        expect(onAmountChange).toHaveBeenCalledWith('1');
        fireEvent.change(input, { target: { value: '10' } });
        expect(onAmountChange).toHaveBeenLastCalledWith('10');
    });

    it('should not call onAmountChange function when the asset is changed', () => {
        const onAmountChange = jest.fn();
        render(<Default onAmountChange={onAmountChange} />);
        expect(onAmountChange).toHaveBeenCalledTimes(0);
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('ETH'));
        expect(onAmountChange).toHaveBeenCalledTimes(0);

        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('WFIL'));
        expect(onAmountChange).toHaveBeenCalledTimes(0);
    });

    it('should call the onAssetChange function when the asset is changed', () => {
        const onAssetChange = jest.fn();
        render(<Default onAssetChange={onAssetChange} />);
        expect(onAssetChange).toHaveBeenCalledWith('WBTC');
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('ETH'));
        expect(onAssetChange).toHaveBeenLastCalledWith('ETH');
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('WFIL'));
        expect(onAssetChange).toHaveBeenLastCalledWith('WFIL');
        expect(onAssetChange).toHaveBeenCalledTimes(3);
    });

    it('should reduce the size of the text when typing a big number', () => {
        render(<Default />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('text-md');
        fireEvent.change(input, { target: { value: '100000000' } });
        expect(input).toHaveClass('text-[20px]');
        fireEvent.change(input, { target: { value: '100000000.22' } });
        expect(input).toHaveClass('text-sm');
    });
});
