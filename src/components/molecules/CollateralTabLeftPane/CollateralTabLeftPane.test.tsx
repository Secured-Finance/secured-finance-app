import * as analytics from '@amplitude/analytics-browser';
import { composeStories } from '@storybook/react';
import { emptyCollateralBook } from 'src/hooks';
import {
    collateralBook80,
    emptyUSDCollateral,
} from 'src/stories/mocks/fixtures';
import { fireEvent, render, screen } from 'src/test-utils.js';
import { ButtonEvents } from 'src/utils';
import * as stories from './CollateralTabLeftPane.stories';

const { Default, NotConnectedToWallet } = composeStories(stories);

describe('CollateralTabLeftPane component', () => {
    const track = jest.spyOn(analytics, 'track');
    it('should render CollateralTabLeftPane', () => {
        render(<NotConnectedToWallet />);
        expect(screen.getByText('Net Asset Value')).toBeInTheDocument();
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

    it('should render disabled buttons when chainError', () => {
        render(<Default />, {
            preloadedState: {
                blockchain: {
                    chainError: true,
                },
            },
        });
        expect(screen.getByTestId('deposit-collateral')).toBeDisabled();
        expect(screen.getByTestId('withdraw-collateral')).toBeDisabled();
    });

    it('should render balance when wallet is connected and collateral is deposited', () => {
        render(<Default />);
        expect(screen.getByText('$12,700.34')).toBeInTheDocument();
        expect(screen.getByText('Collateral Assets')).toBeInTheDocument();
        expect(screen.getByText('Non-collateral Assets')).toBeInTheDocument();
    });

    it('should render enabled buttons when wallet is connected', () => {
        render(<Default />);
        expect(screen.getByTestId('deposit-collateral')).toBeEnabled();
        expect(screen.getByTestId('withdraw-collateral')).toBeEnabled();
    });

    it('should call onClick with deposit and emit DEPOSIT_COLLATERAL_BUTTON event when deposit button is clicked', () => {
        const onClick = jest.fn();
        render(<Default onClick={onClick} />);
        fireEvent.click(screen.getByTestId('deposit-collateral'));
        expect(track).toHaveBeenCalledWith(
            ButtonEvents.DEPOSIT_COLLATERAL_BUTTON
        );
        expect(onClick).toHaveBeenCalledWith('deposit');
    });

    it('should call onClick with withdraw and emit WITHDRAW_COLLATERAL_BUTTON event when withdraw button is clicked', () => {
        const onClick = jest.fn();
        render(<Default onClick={onClick} />);
        fireEvent.click(screen.getByTestId('withdraw-collateral'));
        expect(track).toHaveBeenCalledWith(
            ButtonEvents.WITHDRAW_COLLATERAL_BUTTON
        );
        expect(onClick).toHaveBeenCalledWith('withdraw');
    });

    it('should prompt user to deposit collateral when wallet is connected', () => {
        render(<Default collateralBook={emptyCollateralBook} />);
        expect(screen.getByText('Net Asset Value')).toBeInTheDocument();
        expect(screen.getByText('$12,700.34')).toBeInTheDocument();
        expect(
            screen.getAllByText(
                'Deposit collateral from your connected wallet to enable lending service on Secured Finance.'
            )[0]
        ).toBeInTheDocument();
    });

    it('should render non-collateral asset if usdCollateral is zero and usdNonCollateral is not zero', () => {
        render(<Default collateralBook={emptyUSDCollateral} />);
        expect(
            screen.getAllByText(
                'Deposit collateral from your connected wallet to enable lending service on Secured Finance.'
            )[0]
        ).toBeInTheDocument();
        expect(screen.getByText('Non-collateral Assets')).toBeInTheDocument();
    });

    it('should change font size as collateral increases', async () => {
        render(
            <Default
                collateralBook={{ ...collateralBook80, usdCollateral: 210.2 }}
            />
        );
        const input = screen.getByTestId('vault-balance');
        expect(input).toHaveClass('text-xl');
    });

    it('should change font size as collateral increases', async () => {
        render(<Default netAssetValue={100000.2} />);
        const input = screen.getByTestId('vault-balance');
        expect(input).toHaveClass('text-xl tablet:text-md');
    });

    it('should change font size as collateral increases', async () => {
        render(<Default netAssetValue={210000000.2} />);
        const input = screen.getByTestId('vault-balance');
        expect(input).toHaveClass('text-md tablet:text-smd');
    });
});
