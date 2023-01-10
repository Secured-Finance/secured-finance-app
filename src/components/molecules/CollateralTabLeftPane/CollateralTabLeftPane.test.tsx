import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './CollateralTabLeftPane.stories';

const { Default, NotConnectedToWallet } = composeStories(stories);

describe('CollateralTabLeftPane component', () => {
    it('should render CollateralTabLeftPane', () => {
        render(<NotConnectedToWallet />);
        expect(screen.getByText('Collateral Balance')).toBeInTheDocument();
        expect(screen.getByText('$0.00')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Connect your wallet to see your deposited collateral balance.'
            )
        ).toBeInTheDocument();
    });

    it('should render disabled buttons when wallet is not conencted', () => {
        render(<NotConnectedToWallet />);
        expect(screen.getByTestId('deposit-collateral')).toBeDisabled();
        expect(screen.getByTestId('withdraw-collateral')).toBeDisabled();
    });

    it('should render balance when wallet is connected and collateral is deposited', () => {
        render(<Default />);
        expect(screen.getByText('$2,100.34')).toBeInTheDocument();
    });

    it('should render enabled buttons when wallet is connected', () => {
        render(<Default />);
        expect(screen.getByTestId('deposit-collateral')).toBeEnabled();
        expect(screen.getByTestId('withdraw-collateral')).toBeEnabled();
    });

    it('should call onClick with deposit when deposit button is clicked', () => {
        const onClick = jest.fn();
        render(<Default onClick={onClick} />);
        fireEvent.click(screen.getByTestId('deposit-collateral'));
        expect(onClick).toHaveBeenCalledWith('deposit');
    });

    it('should call onClick with withdraw when withdraw button is clicked', () => {
        const onClick = jest.fn();
        render(<Default onClick={onClick} />);
        fireEvent.click(screen.getByTestId('withdraw-collateral'));
        expect(onClick).toHaveBeenCalledWith('withdraw');
    });
});
