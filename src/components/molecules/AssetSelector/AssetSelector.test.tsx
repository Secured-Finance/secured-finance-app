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
        expect(screen.getByText(`1,012.00 USD`)).toBeInTheDocument();
        fireEvent.change(input, { target: { value: '10' } });
        expect(screen.getByText(`10,120.00 USD`)).toBeInTheDocument();
    });

    it('should transform the option selected with the transform function', () => {
        render(<Default />);
        expect(
            screen.getByTestId('asset-selector-transformed-value')
        ).toHaveTextContent('BTC');
        fireEvent.click(screen.getByRole('button'));
        const option = Default.args.options[3].name;
        fireEvent.click(screen.getByText(option));
        expect(
            screen.getByTestId('asset-selector-transformed-value')
        ).toHaveTextContent('USDC');
    });
});
