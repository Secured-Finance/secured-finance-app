import { composeStories } from '@storybook/react';
import mockRouter from 'next-router-mock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './Header.stories';

const { Primary } = composeStories(stories);

jest.mock(
    'next/link',
    () =>
        ({ children }: { children: React.ReactNode }) =>
            children
);

describe('Header component', () => {
    it('should render the header', () => {
        mockRouter.push('/');
        render(<Primary />);
        expect(screen.getByText('Trading')).toBeInTheDocument();
        expect(screen.getByText('Markets')).toBeInTheDocument();
        expect(screen.getByText('Portfolio')).toBeInTheDocument();
        expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    });

    it('should highlight the landing page by default page', () => {
        mockRouter.push('/');
        render(<Primary />);
        const textElement = screen.getByText('Trading');
        expect(textElement.parentNode?.parentNode).toHaveClass(
            'from-tabGradient-blue-start to-tabGradient-blue-end'
        );
    });

    it('should highlight the landing page when on global-itayose', () => {
        mockRouter.push('/global-itayose');
        render(<Primary />);
        const textElement = screen.getByText('Trading');
        expect(textElement.parentNode?.parentNode).toHaveClass(
            'from-tabGradient-blue-start to-tabGradient-blue-end'
        );
    });

    it('should highlight the dashboard page when on dashboard page', () => {
        mockRouter.push('/dashboard');

        render(<Primary />);
        fireEvent.click(screen.getByText('Markets'));

        const textElement = screen.getByText('Markets');
        expect(textElement.parentNode?.parentNode).toHaveClass(
            'from-tabGradient-blue-start to-tabGradient-blue-end'
        );
    });

    it('should highlight the landing page when on advanced page', () => {
        mockRouter.push('/');

        render(<Primary />);
        const textElement = screen.getByText('Trading');
        expect(textElement.parentNode?.parentNode).toHaveClass(
            'from-tabGradient-blue-start to-tabGradient-blue-end'
        );
    });

    it('should render testnet info header on chainError false and isChainIdDetected true', () => {
        mockRouter.push('/');

        render(<Primary />, {
            preloadedState: {
                blockchain: {
                    chainId: 11155111,
                    chainError: false,
                    isChainIdDetected: true,
                },
            },
        });
        expect(screen.getByTestId('testnet-info')).toBeInTheDocument();
        expect(
            screen.getByText('You are visiting Secured Finance on testnet')
        ).toBeInTheDocument();
    });

    it('should render testnet alert header on chainError and isChainIdDetected true', () => {
        mockRouter.push('/');

        render(<Primary />, {
            preloadedState: {
                blockchain: {
                    chainId: 11155111,
                    chainError: true,
                    isChainIdDetected: true,
                },
            },
        });
        expect(screen.getByTestId('testnet-alert')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Secured Finance is not supported on this network. Please switch to a supported network.'
            )
        ).toBeInTheDocument();
    });

    it('should not render testnet header if current chain is mainnet', () => {
        mockRouter.push('/');

        render(<Primary />, {
            preloadedState: {
                blockchain: {
                    chainId: 1,
                    chainError: false,
                },
            },
        });
        expect(screen.queryByTestId('testnet-info')).not.toBeInTheDocument();
        expect(screen.queryByTestId('testnet-alert')).not.toBeInTheDocument();
    });

    it('should not display SF Points if the user is not logged in', async () => {
        render(<Primary />);

        await waitFor(() => {
            expect(screen.queryByText('164 Points')).not.toBeInTheDocument(); //
        });
    });
});
