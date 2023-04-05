import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import { WalletSource } from 'src/utils';
import * as stories from './WalletSourceSelector.stories';

const { Default } = composeStories(stories);

describe('WalletSourceSelector component', () => {
    it('should render WalletSourceSelector', () => {
        render(<Default />);
        expect(screen.getByText('Lending Source')).toBeInTheDocument();
        expect(screen.getByText('Available to Lend')).toBeInTheDocument();
        expect(screen.getByText('METAMASK')).toBeInTheDocument();
        expect(screen.getByText('1,000 BTC')).toBeInTheDocument();
    });

    it('should render a clickable button', () => {
        render(<Default />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render a dropdown', () => {
        render(<Default />);
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it.skip('should change the button when a dropdown item is selected', () => {
        const onChange = jest.fn();
        render(<Default onChange={onChange} />);

        expect(onChange).toBeCalledTimes(1);
        expect(onChange).toHaveBeenLastCalledWith(WalletSource.METAMASK);

        fireEvent.click(screen.getByTestId('wallet-source-selector-button'));
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
