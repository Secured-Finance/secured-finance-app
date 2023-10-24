import { composeStories } from '@storybook/react';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './CollateralSelector.stories';

const { Default } = composeStories(stories);

describe('CollateralSelector component', () => {
    it('should render CollateralSelector', () => {
        render(<Default />);
        expect(screen.getByText('Select Asset')).toBeInTheDocument();
        expect(screen.getByText('USDC')).toBeInTheDocument();
        expect(screen.getByText('1,000 USDC Available')).toBeInTheDocument();
    });

    it('should render a clickable button', () => {
        render(<Default />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render a dropdown', async () => {
        render(<Default />);
        fireEvent.click(screen.getByRole('button'));
        await waitFor(() => {
            expect(screen.getByRole('listbox')).toBeInTheDocument();
        });
    });

    it('should change the button when a dropdown item is selected', () => {
        const onChange = jest.fn();
        render(<Default onChange={onChange} />);

        expect(onChange).toBeCalledTimes(1);
        expect(onChange).toHaveBeenLastCalledWith({
            available: 1000,
            name: 'USDC',
            symbol: 'USDC',
        });

        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-1'));
        expect(screen.getByText('Ethereum')).toBeInTheDocument();
        expect(screen.getByText('120 Ethereum Available')).toBeInTheDocument();

        expect(onChange).toBeCalledTimes(2);
        expect(onChange).toHaveBeenLastCalledWith({
            available: 120,
            name: 'Ethereum',
            symbol: 'ETH',
        });
    });
});
