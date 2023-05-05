import { composeStories } from '@storybook/testing-react';
import { BigNumber } from 'ethers';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './AssetSelector.stories';

const { Default } = composeStories(stories);

describe('AssetSelector Component', () => {
    const amountFormatterMap = {
        ['WBTC']: (amount: number) => BigNumber.from(amount * 100),
        ['ETH']: (amount: number) => BigNumber.from(amount * 1000),
    };

    it('should render a AssetSelector', () => {
        render(<Default />);
    });

    it('should display the amount in USD when entered a currency', () => {
        render(<Default />);
        const input = screen.getByRole('textbox');
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('Ethereum'));
        fireEvent.change(input, { target: { value: '1' } });
        expect(screen.getByText(`~ 1,012 USD`)).toBeInTheDocument();
        fireEvent.change(input, { target: { value: '10' } });
        expect(screen.getByText(`~ 10,120 USD`)).toBeInTheDocument();
    });

    it('should transform the option selected with the transform function', () => {
        render(<Default />);
        expect(
            screen.getByTestId('asset-selector-transformed-value')
        ).toHaveTextContent('WBTC');
        fireEvent.click(screen.getByRole('button'));

        fireEvent.click(screen.getByText('EFIL'));
        expect(
            screen.getByTestId('asset-selector-transformed-value')
        ).toHaveTextContent('EFIL');
    });

    it('should call the onAmountChange function when the amount is changed', () => {
        const onAmountChange = jest.fn();
        render(<Default onAmountChange={onAmountChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '1' } });
        expect(onAmountChange).toHaveBeenCalled();
    });

    it('should call onAmountChange function with the amount converted to BigNumber if no amountFormatterMap was provided', () => {
        const onAmountChange = jest.fn();
        render(<Default onAmountChange={onAmountChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '1' } });
        expect(onAmountChange).toHaveBeenCalledWith(BigNumber.from(1));
        fireEvent.change(input, { target: { value: '10' } });
        expect(onAmountChange).toHaveBeenLastCalledWith(BigNumber.from(10));
    });

    it('should call onAmountChange function with the amount converted to BigNumber with the function from amountFormatterMap', () => {
        const onAmountChange = jest.fn();
        render(
            <Default
                onAmountChange={onAmountChange}
                amountFormatterMap={amountFormatterMap}
            />
        );
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '1' } });
        expect(onAmountChange).toHaveBeenCalledWith(BigNumber.from(100));
        fireEvent.change(input, { target: { value: '10' } });
        expect(onAmountChange).toHaveBeenLastCalledWith(BigNumber.from(1000));
    });

    it('should call onAmountChange function when the asset is changed', () => {
        const onAmountChange = jest.fn();
        render(<Default onAmountChange={onAmountChange} />);
        expect(onAmountChange).toHaveBeenCalledTimes(1);
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('Ethereum'));
        expect(onAmountChange).toHaveBeenCalledTimes(2);

        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('EFIL'));
        expect(onAmountChange).toHaveBeenCalledTimes(3);
    });

    it('should call the onAssetChange function when the asset is changed', () => {
        const onAssetChange = jest.fn();
        render(<Default onAssetChange={onAssetChange} />);
        expect(onAssetChange).toHaveBeenCalledWith('WBTC');
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('Ethereum'));
        expect(onAssetChange).toHaveBeenLastCalledWith('ETH');
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('EFIL'));
        expect(onAssetChange).toHaveBeenLastCalledWith('EFIL');
        expect(onAssetChange).toHaveBeenCalledTimes(3);
    });

    it('should call the onAmountChange function when the asset is changed', () => {
        const onAmountChange = jest.fn();
        render(
            <Default
                onAmountChange={onAmountChange}
                amountFormatterMap={amountFormatterMap}
            />
        );
        expect(onAmountChange).toHaveBeenCalledWith(BigNumber.from(0));
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '1' } });
        expect(onAmountChange).toHaveBeenLastCalledWith(BigNumber.from(100));
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('Ethereum'));
        expect(onAmountChange).toHaveBeenLastCalledWith(BigNumber.from(1000));
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('EFIL'));
        expect(onAmountChange).toHaveBeenLastCalledWith(BigNumber.from(1));
    });
    it('should resize the text when length of text changes', async () => {
        render(<Default fontSize={{ small: 'text-sm', large: 'text-lg' }} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '1' } });
        expect(input).toHaveClass('text-lg');
        fireEvent.input(input, { target: { value: '123456789' } });
        expect(input).toHaveClass('text-lg');
        fireEvent.input(input, { target: { value: '1234567890' } });
        expect(input).toHaveClass('text-sm');
        fireEvent.input(input, { target: { value: '12345' } });
        expect(input).toHaveClass('text-lg');
    });
});
