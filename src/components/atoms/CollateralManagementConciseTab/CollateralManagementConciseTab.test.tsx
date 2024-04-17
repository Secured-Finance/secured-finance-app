import { composeStories } from '@storybook/react';
import { useCollateralBook } from 'src/hooks';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CollateralManagementConciseTab.stories';

const {
    NotConnectedToWallet,
    ZeroCollateral,
    CollateralDepositedZeroCoverage,
    CollateralDepositedWithCoverage,
} = composeStories(stories);

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('CollateralManagementConciseTab component', () => {
    const { result } = renderHook(() => useCollateralBook('0x1'));

    it('should render not connected to wallet concise tab', () => {
        render(<NotConnectedToWallet />);
        expect(screen.getByText('Collateral Utilization')).toBeInTheDocument();
        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.getByTestId('collateral-progress-bar-track')).toHaveStyle(
            'width: calc(100% * 0)'
        );

        expect(screen.getByText('Liquidation Risk')).toBeInTheDocument();
        expect(screen.getByText('Low')).toBeInTheDocument();
        expect(screen.getByText('Low')).toHaveClass('text-progressBarStart');
        expect(screen.getByTestId('liquidation-progress-bar-tick')).toHaveStyle(
            'left: calc(0% - 4px)'
        );
        expect(screen.getAllByText('N/A')).toHaveLength(2);
    });

    it('should render zero collateral concise tab', async () => {
        render(<ZeroCollateral />);

        const value = result.current;
        expect(value.data).toEqual(undefined);
        expect(value.isLoading).toEqual(true);

        await waitFor(() =>
            expect(mock.tokenVault.getCollateralBook).toHaveBeenCalledTimes(1)
        );

        expect(screen.getByText('Collateral Utilization')).toBeInTheDocument();
        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.getByTestId('collateral-progress-bar-track')).toHaveStyle(
            'width: calc(100% * 0)'
        );
        expect(screen.getByText('$0.00')).toBeInTheDocument();
        expect(screen.getByText('of $12,100.34 available')).toBeInTheDocument();

        expect(screen.getByText('Liquidation Risk')).toBeInTheDocument();
        expect(screen.getByText('Low')).toBeInTheDocument();
        expect(screen.getByText('Low')).toHaveClass('text-progressBarStart');
        expect(screen.getByTestId('liquidation-progress-bar-tick')).toHaveStyle(
            'left: calc(0% - 4px)'
        );
        expect(screen.getByText('80%')).toBeInTheDocument();
    });

    it('should render collateral deposited zero coverage concise tab', async () => {
        render(<CollateralDepositedZeroCoverage />);

        renderHook(() => useCollateralBook('0x1'));

        await waitFor(() =>
            expect(mock.tokenVault.getCollateralBook).toHaveBeenCalledTimes(3)
        );

        expect(screen.getByText('Collateral Utilization')).toBeInTheDocument();
        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.getByTestId('collateral-progress-bar-track')).toHaveStyle(
            'width: calc(100% * 0)'
        );
        expect(screen.getByText('$80.00')).toBeInTheDocument();
        expect(screen.getByText('of $12,100.34 available')).toBeInTheDocument();

        expect(screen.getByText('Liquidation Risk')).toBeInTheDocument();
        expect(screen.getByText('Low')).toBeInTheDocument();
        expect(screen.getByText('Low')).toHaveClass('text-progressBarStart');
        expect(screen.getByTestId('liquidation-progress-bar-tick')).toHaveStyle(
            'left: calc(0% - 4px)'
        );
        expect(screen.getByText('80%')).toBeInTheDocument();
    });

    it('should render CollateralManagementConciseTab', async () => {
        render(<CollateralDepositedWithCoverage />);

        renderHook(() => useCollateralBook('0x1'));

        await waitFor(() =>
            expect(mock.tokenVault.getCollateralBook).toHaveBeenCalledTimes(5)
        );

        expect(screen.getByText('Collateral Utilization')).toBeInTheDocument();
        expect(screen.getByText('37%')).toBeInTheDocument();
        expect(screen.getByTestId('collateral-progress-bar-track')).toHaveStyle(
            'width: calc(100% * 0.37)'
        );

        expect(screen.getByText('$43.00')).toBeInTheDocument();
        expect(screen.getByText('of $12,100.34 available')).toBeInTheDocument();

        expect(screen.getByText('Liquidation Risk')).toBeInTheDocument();
        expect(screen.getByText('Low')).toBeInTheDocument();
        expect(screen.getByText('Low')).toHaveClass('text-progressBarStart');
        expect(screen.getByText('43%')).toBeInTheDocument();
        expect(screen.getByTestId('liquidation-progress-bar-tick')).toHaveStyle(
            'left: calc(85% - 4px)'
        );
    });

    it('should render correct color and risk status', () => {
        render(<CollateralDepositedWithCoverage collateralCoverage={0} />);
        expect(screen.getByText('80%')).toBeInTheDocument();
        expect(screen.getByText('Low')).toBeInTheDocument();
        expect(screen.getByText('Low')).toHaveClass('text-progressBarStart');

        render(<CollateralDepositedWithCoverage collateralCoverage={50} />);
        expect(screen.getByText('30%')).toBeInTheDocument();
        expect(screen.getByText('Medium')).toBeInTheDocument();
        expect(screen.getByText('Medium')).toHaveClass('text-progressBarVia');

        render(<CollateralDepositedWithCoverage collateralCoverage={70} />);
        expect(screen.getByText('10%')).toBeInTheDocument();
        expect(screen.getByText('High')).toBeInTheDocument();
        expect(screen.getByText('High')).toHaveClass('text-progressBarEnd');
    });
});
