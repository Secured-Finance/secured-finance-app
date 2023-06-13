import { composeStories } from '@storybook/testing-react';
import {
    emptyCollateralBook,
    emptyUSDCollateral,
} from 'src/stories/mocks/fixtures';
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
        expect(screen.getByText('Collateral Assets')).toBeInTheDocument();
        expect(screen.getByText('Non-collateral Assets')).toBeInTheDocument();
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

    it('should prompt user to deposit collateral when wallet is connected', () => {
        render(<Default collateralBook={emptyCollateralBook} />);
        expect(screen.getByText('Collateral Balance')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Deposit collateral from your connected wallet to enable lending service on Secured Finance.'
            )
        ).toBeInTheDocument();
    });

    it('should render non-collateral asset if usdCollateral is zero and usdNonCollateral is not zero', () => {
        render(<Default collateralBook={emptyUSDCollateral} />);
        expect(
            screen.getByText(
                'Deposit collateral from your connected wallet to enable lending service on Secured Finance.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Non-collateral Assets')).toBeInTheDocument();
    });
});
