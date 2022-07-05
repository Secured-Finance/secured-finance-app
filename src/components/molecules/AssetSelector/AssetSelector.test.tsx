import { composeStories } from '@storybook/testing-react';
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
        ).toHaveTextContent('BTC');
        fireEvent.click(screen.getByRole('button'));

        fireEvent.click(screen.getByText('Filecoin'));
        expect(
            screen.getByTestId('asset-selector-transformed-value')
        ).toHaveTextContent('FIL');
    });

    it('should call the onAmountChange function when the amount is changed', () => {
        const onAmountChange = jest.fn();
        render(<Default onAmountChange={onAmountChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '1' } });
        expect(onAmountChange).toHaveBeenCalledWith(1);
    });

    it('should call the onAssetChange function when the asset is changed', () => {
        const onAssetChange = jest.fn();
        render(<Default onAssetChange={onAssetChange} />);
        expect(onAssetChange).toHaveBeenCalledWith('Bitcoin');
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('Ethereum'));
        expect(onAssetChange).toHaveBeenLastCalledWith('Ethereum');
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('Filecoin'));
        expect(onAssetChange).toHaveBeenLastCalledWith('Filecoin');
        expect(onAssetChange).toHaveBeenCalledTimes(3);
    });
});
