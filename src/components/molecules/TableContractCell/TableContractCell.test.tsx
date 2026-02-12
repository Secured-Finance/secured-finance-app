import { composeStories } from '@storybook/react';
import userEvent from '@testing-library/user-event';
import { MarketPhase } from 'src/hooks';
import { render, screen } from 'src/test-utils.js';
import * as stories from './TableContractCell.stories';

const { Default, Compact, ContractOnly, Delisted } = composeStories(stories);

const mockPush = jest.fn();
jest.mock('next/router', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

const mockUseMarketPhase = jest.fn();
jest.mock('src/hooks/useLendingMarkets/useMarketPhase', () => {
    const actual = jest.requireActual(
        'src/hooks/useLendingMarkets/useMarketPhase'
    );
    return {
        ...actual,
        useMarketPhase: (...args: unknown[]) => mockUseMarketPhase(...args),
    };
});

describe('TableContractCell Component', () => {
    describe('Default Variant', () => {
        it('should display the name of the currency by default', () => {
            render(<Default />);
            expect(screen.getByText('Ether')).toBeInTheDocument();
        });

        it('should display the name of the contract with the currency', () => {
            render(<Default />);
            expect(screen.getByText('ETH-DEC22')).toBeInTheDocument();
        });

        it('should display a larger image by default', () => {
            render(<Default />);
            expect(screen.getByRole('img')).toHaveClass('w-6 h-6');
        });

        it('should display the tooltip if delisted is true', async () => {
            render(<Delisted />);
            const information = screen.getByTestId('delisted-tooltip');
            await userEvent.unhover(information);
            await userEvent.hover(information);
            const tooltip = await screen.findByText(
                'Delisting: Redemption will be available 7 days post-maturity.'
            );
            expect(tooltip).toBeInTheDocument();
        });
    });

    describe('Compact Variant', () => {
        it('should not display the name of the currency in the compact variant', () => {
            render(<Compact />);
            expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
        });

        it('should display a smaller image in the compact variant', () => {
            render(<Compact />);
            expect(screen.getByRole('img')).toHaveClass('w-4 h-4');
        });
    });

    describe('Contract Only Variant', () => {
        it('should only display the contract name in the contract only variant', () => {
            render(<ContractOnly />);
            expect(screen.getByText('DEC22')).toBeInTheDocument();
            expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
            expect(screen.queryByRole('img')).not.toBeInTheDocument();
        });
    });

    describe('Navigation and Interaction', () => {
        beforeEach(() => {
            mockPush.mockClear();
            mockUseMarketPhase.mockClear();
        });

        it('should navigate when contract is clicked and market is open', async () => {
            mockUseMarketPhase.mockReturnValue(MarketPhase.OPEN);
            render(<Default />);

            const contractCell = screen.getByText('ETH-DEC22');
            await userEvent.click(contractCell);

            expect(mockPush).toHaveBeenCalledWith({
                pathname: '/',
                query: {
                    market: 'ETH-DEC2022',
                },
            });
        });

        it('should handle keyboard events correctly', async () => {
            mockUseMarketPhase.mockReturnValue(MarketPhase.OPEN);
            render(<Default />);

            const contractCell = screen.getByRole('button');

            // Test Enter key
            await userEvent.type(contractCell, '{Enter}');
            expect(mockPush).toHaveBeenCalledTimes(2);
            expect(mockPush).toHaveBeenCalledWith({
                pathname: '/',
                query: {
                    market: 'ETH-DEC2022',
                },
            });

            mockPush.mockClear();

            // Test Space key
            await userEvent.type(contractCell, ' ');
            expect(mockPush).toHaveBeenCalledTimes(2);
            expect(mockPush).toHaveBeenCalledWith({
                pathname: '/',
                query: {
                    market: 'ETH-DEC2022',
                },
            });
        });

        it('should not be clickable when market phase is matured', async () => {
            mockUseMarketPhase.mockReturnValue(MarketPhase.MATURED);
            render(<Default />);

            const contractCell = screen.getByText('ETH-DEC22');
            expect(
                contractCell.closest('[role="button"]')
            ).not.toBeInTheDocument();

            await userEvent.click(contractCell);
            expect(mockPush).not.toHaveBeenCalled();
        });

        it('should be clickable during PRE_ORDER phase', async () => {
            mockUseMarketPhase.mockReturnValue(MarketPhase.PRE_ORDER);
            render(<Default />);

            const contractCell = screen.getByText('ETH-DEC22');
            await userEvent.click(contractCell);

            expect(mockPush).toHaveBeenCalledWith({
                pathname: '/',
                query: {
                    market: 'ETH-DEC2022',
                },
            });
        });

        it('should be clickable during ITAYOSE phase', async () => {
            mockUseMarketPhase.mockReturnValue(MarketPhase.ITAYOSE);
            render(<Default />);

            const contractCell = screen.getByText('ETH-DEC22');
            await userEvent.click(contractCell);

            expect(mockPush).toHaveBeenCalledWith({
                pathname: '/',
                query: {
                    market: 'ETH-DEC2022',
                },
            });
        });
    });
});
