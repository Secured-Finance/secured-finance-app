import { composeStories } from '@storybook/testing-react';
import { preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './WithdrawCollateral.stories';

const { Default } = composeStories(stories);

const preloadedState = {
    ...preloadedAssetPrices,
};

describe('WithdrawCollateral component', () => {
    it('should display the WithdrawCollateral Modal when open', () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Withdraw Collateral')).toBeInTheDocument();

        const button = screen.getByTestId('dialog-action-button');
        expect(button).toHaveTextContent('Continue');
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should open with collateral amount 0', () => {
        render(<Default />);
        expect(screen.getByRole('textbox').getAttribute('value')).toBe('0');
        expect(screen.getByRole('textbox').getAttribute('placeholder')).toBe(
            '0'
        );
    });

    it('should disable the continue button when collateral amount is 0 and continue button is clicked', () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);

        const button = screen.getByTestId('dialog-action-button');
        expect(button).toBeDisabled();
    });

    it('should select asset and update amount', () => {
        render(<Default />, { preloadedState });

        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-2'));
        expect(screen.getByText('USDC')).toBeInTheDocument();
        expect(screen.getByText('50 USDC Available')).toBeInTheDocument();

        const tab = screen.getByTestId(100);
        fireEvent.click(tab);
        expect(screen.getByText('$50.00')).toBeInTheDocument();
    });

    it('should proceed to failure screen and call onclose when block number is undefined', async () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />, { preloadedState });
        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-2'));
        expect(screen.getByText('USDC')).toBeInTheDocument();
        expect(screen.getByText('50 USDC Available')).toBeInTheDocument();

        const tab = screen.getByTestId(75);
        fireEvent.click(tab);
        expect(screen.getByText('$37.50')).toBeInTheDocument();

        const button = screen.getByTestId('dialog-action-button');
        fireEvent.click(button);

        await waitFor(() =>
            expect(screen.queryByText('Success!')).not.toBeInTheDocument()
        );
        await waitFor(() =>
            expect(screen.queryByText('Failed!')).toBeInTheDocument()
        );
        const onCloseButton = screen.getByTestId('dialog-action-button');
        fireEvent.click(onCloseButton);

        await waitFor(() => expect(onClose).toBeCalled());
    });

    it('should disable the continue button when collateral amount is greater than available amount and continue button is clicked', () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);
        const input = screen.getByRole('textbox');
        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-0'));
        expect(screen.getByText('Ethereum')).toBeInTheDocument();
        expect(screen.getByText('1 Ethereum Available')).toBeInTheDocument();
        fireEvent.change(input, { target: { value: '10' } });
        const button = screen.getByTestId('dialog-action-button');
        expect(button).toBeDisabled();
    });
});
