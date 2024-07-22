import { composeStories } from '@storybook/react';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import { CurrencySymbol } from 'src/utils';
import * as stories from './Selector.stories';

const { Default } = composeStories(stories);

describe('CollateralSelector component', () => {
    it('should render CollateralSelector', () => {
        render(<Default />);
        expect(screen.getByText('Select Asset')).toBeInTheDocument();
        expect(screen.getByText('Label 1')).toBeInTheDocument();
        expect(screen.getByText('note 1')).toBeInTheDocument();
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
            note: 'note 1',
            label: 'Label 1',
            value: 'value1',
        });

        fireEvent.click(screen.getByTestId('main-selector-button'));
        fireEvent.click(screen.getByTestId('main-option-value1'));
        expect(screen.getByText('Label 1')).toBeInTheDocument();
        expect(screen.getByText('note 1')).toBeInTheDocument();

        expect(onChange).toBeCalledTimes(1);
    });

    it('should open with the selected option if provided', () => {
        const onChange = jest.fn();
        render(
            <Default
                onChange={onChange}
                selectedOption={{
                    label: 'Ethereum',
                    value: CurrencySymbol.ETH,
                    note: '120 ETH Available',
                }}
            />
        );

        expect(onChange).toBeCalledTimes(1);
        expect(onChange).toHaveBeenLastCalledWith({
            note: '120 ETH Available',
            label: 'Ethereum',
            value: 'ETH',
        });

        expect(screen.getByText('Ethereum')).toBeInTheDocument();
        expect(screen.getByText('120 ETH Available')).toBeInTheDocument();
    });
});
