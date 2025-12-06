import { composeStories } from '@storybook/react';
import { initialStore } from 'src/stories/mocks/mockStore';
import { account, connector } from 'src/stories/mocks/mockWallet';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './Settings.stories';

const { Default } = composeStories(stories);

// Mock useAccount to return our mock connector
jest.mock('wagmi', () => ({
    ...jest.requireActual('wagmi'),
    useAccount: () => ({
        address: account.address,
        connector: connector,
        isConnected: true,
    }),
}));

describe('Settings component', () => {
    it('should render settings component', async () => {
        render(<Default />);
        const walletButton = await screen.findByRole('button');
        fireEvent.click(walletButton);
        expect(await screen.findByText('Global Settings')).toBeInTheDocument();
    });

    it('should render un checked testnet button', async () => {
        render(<Default />, {
            preloadedState: {
                ...initialStore,
                blockchain: {
                    ...initialStore.blockchain,
                    testnetEnabled: false,
                },
            },
        });
        const walletButton = await screen.findByRole('button');
        fireEvent.click(walletButton);
        const button = await screen.findByRole('switch');
        expect(button).toHaveAttribute('aria-checked', 'false');

        fireEvent.click(button);

        await waitFor(() =>
            expect(button).toHaveAttribute('aria-checked', 'true')
        );
    });

    it('should render disabled and checked testnet button', async () => {
        render(<Default isProduction={false} />);
        const walletButton = await screen.findByRole('button');
        fireEvent.click(walletButton);
        const button = await screen.findByRole('switch');
        expect(button).toHaveClass('disabled:opacity-50');
        expect(button).toHaveAttribute('aria-checked', 'true');

        fireEvent.click(button);
        expect(button).toHaveAttribute('aria-checked', 'true');
    }, 8000);

    it('should update Redux state when toggling testnet mode', async () => {
        const { store } = render(<Default />, {
            preloadedState: {
                ...initialStore,
                blockchain: {
                    ...initialStore.blockchain,
                    chainId: 1, // Ethereum mainnet
                    testnetEnabled: false,
                },
            },
        });

        const walletButton = await screen.findByRole('button');
        fireEvent.click(walletButton);
        const toggle = await screen.findByRole('switch');

        expect(store.getState().blockchain.testnetEnabled).toBe(false);

        fireEvent.click(toggle);

        await waitFor(() =>
            expect(store.getState().blockchain.testnetEnabled).toBe(true)
        );
    });

    it('should reflect correct testnet mode when on Sepolia', async () => {
        render(<Default />, {
            preloadedState: {
                ...initialStore,
                blockchain: {
                    ...initialStore.blockchain,
                    chainId: 11155111, // Sepolia
                    testnetEnabled: true,
                },
            },
        });

        const walletButton = await screen.findByRole('button');
        fireEvent.click(walletButton);
        const toggle = await screen.findByRole('switch');

        expect(toggle).toHaveAttribute('aria-checked', 'true');
    });

    it('should reflect correct testnet mode when on Ethereum mainnet', async () => {
        render(<Default />, {
            preloadedState: {
                ...initialStore,
                blockchain: {
                    ...initialStore.blockchain,
                    chainId: 1, // Ethereum
                    testnetEnabled: false,
                },
            },
        });

        const walletButton = await screen.findByRole('button');
        fireEvent.click(walletButton);
        const toggle = await screen.findByRole('switch');

        expect(toggle).toHaveAttribute('aria-checked', 'false');
    });
});
