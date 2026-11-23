import { composeStories } from '@storybook/react';
import mockRouter from 'next-router-mock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import { mockRuntimeConfig } from 'src/stories/mocks/runtimeConfigMock';
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
        expect(screen.getByText('Fixed Income')).toBeInTheDocument();
        expect(screen.getByText('Stats')).toBeInTheDocument();
        expect(screen.getByText('Portfolio')).toBeInTheDocument();
        expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    });

    it('should highlight the landing page by default page', () => {
        mockRouter.push('/');
        render(<Primary />);
        const textElement = screen.getByText('Fixed Income');
        expect(textElement.parentNode?.parentNode).toHaveClass(
            'from-tabGradient-blue-start to-tabGradient-blue-end'
        );
    });

    it('should highlight the landing page when on global-itayose', () => {
        mockRouter.push('/global-itayose');
        render(<Primary />);
        const textElement = screen.getByText('Fixed Income');
        expect(textElement.parentNode?.parentNode).toHaveClass(
            'from-tabGradient-blue-start to-tabGradient-blue-end'
        );
    });

    it('should highlight the stats page when on stats page', () => {
        mockRouter.push('/stats');

        render(<Primary />);
        fireEvent.click(screen.getByText('Stats'));

        const textElement = screen.getByText('Stats');
        expect(textElement.parentNode?.parentNode).toHaveClass(
            'from-tabGradient-blue-start to-tabGradient-blue-end'
        );
    });

    it('should highlight the landing page when on advanced page', () => {
        mockRouter.push('/');

        render(<Primary />);
        const textElement = screen.getByText('Fixed Income');
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

    describe('Runtime config alerts', () => {
        it('should not render any alert by default', async () => {
            mockRouter.push('/');
            render(<Primary />);
            await waitFor(() => expect(global.fetch).toHaveBeenCalled());
            expect(
                screen.queryByTestId('incident-alert')
            ).not.toBeInTheDocument();
            expect(
                screen.queryByTestId('reopening-alert')
            ).not.toBeInTheDocument();
            expect(screen.queryByTestId('pause-alert')).not.toBeInTheDocument();
        });

        it('should not render any alert when the messages are empty', async () => {
            mockRuntimeConfig({
                incidentAlert: {
                    message: '',
                    link: 'https://x.com/Secured_Fi/status/1',
                },
                reopeningAlert: { message: '' },
                pauseAlert: { message: '' },
            });

            mockRouter.push('/');
            render(<Primary />);

            await waitFor(() => expect(global.fetch).toHaveBeenCalled());
            expect(
                screen.queryByTestId('incident-alert')
            ).not.toBeInTheDocument();
            expect(
                screen.queryByTestId('reopening-alert')
            ).not.toBeInTheDocument();
            expect(screen.queryByTestId('pause-alert')).not.toBeInTheDocument();
        });

        it('should render an incident alert when a message is set', async () => {
            mockRuntimeConfig({
                incidentAlert: {
                    message: 'Incident message',
                    link: 'https://x.com/Secured_Fi/status/1',
                },
            });

            mockRouter.push('/');
            render(<Primary />);

            expect(
                await screen.findByTestId('incident-alert')
            ).toHaveTextContent('Incident message');
            expect(screen.getByText('our official X account.')).toHaveAttribute(
                'href',
                'https://x.com/Secured_Fi/status/1'
            );
        });

        it('should not render the official updates link when no link is set', async () => {
            mockRuntimeConfig({
                incidentAlert: { message: 'Incident message' },
            });

            mockRouter.push('/');
            render(<Primary />);

            expect(
                await screen.findByTestId('incident-alert')
            ).toBeInTheDocument();
            expect(
                screen.queryByText('our official X account.')
            ).not.toBeInTheDocument();
        });

        it('should render the pause alert when a message is set', async () => {
            mockRuntimeConfig({ pauseAlert: { message: 'Pause message' } });

            mockRouter.push('/');
            render(<Primary />);

            expect(await screen.findByTestId('pause-alert')).toHaveTextContent(
                'Pause message'
            );
        });

        it('should render a reopening alert when a message is set', async () => {
            mockRuntimeConfig({
                reopeningAlert: {
                    message: 'Reopening message',
                    link: 'https://x.com/Secured_Fi/status/1',
                },
            });

            mockRouter.push('/');
            render(<Primary />);

            expect(
                await screen.findByTestId('reopening-alert')
            ).toHaveTextContent('Reopening message');
            expect(screen.getByText('Read the full update.')).toHaveAttribute(
                'href',
                'https://x.com/Secured_Fi/status/1'
            );
        });

        it('should not render the read-more link when no link is set', async () => {
            mockRuntimeConfig({
                reopeningAlert: { message: 'Reopening message' },
            });

            mockRouter.push('/');
            render(<Primary />);

            expect(
                await screen.findByTestId('reopening-alert')
            ).toBeInTheDocument();
            expect(
                screen.queryByText('Read the full update.')
            ).not.toBeInTheDocument();
        });

        it('should render the maintenance alert on a chain under maintenance', async () => {
            mockRuntimeConfig({ maintenanceChainIds: [314159] });

            mockRouter.push('/');
            render(<Primary />, {
                preloadedState: {
                    blockchain: { chainId: 314159, chainError: false },
                },
            });

            expect(
                await screen.findByTestId('maintenance-alert')
            ).toHaveTextContent(
                'Trading on Filecoin is temporarily paused for maintenance. Placing, cancelling and unwinding orders is unavailable. Deposits and withdrawals work as usual. We will announce here when trading resumes.'
            );
        });

        it('should not render the maintenance alert on other chains', async () => {
            mockRuntimeConfig({
                pauseAlert: { message: 'Pause message' },
                maintenanceChainIds: [314159],
            });

            mockRouter.push('/');
            render(<Primary />, {
                preloadedState: {
                    blockchain: { chainId: 11155111, chainError: false },
                },
            });

            // the pause alert shows once the config has loaded
            expect(
                await screen.findByTestId('pause-alert')
            ).toBeInTheDocument();
            expect(
                screen.queryByTestId('maintenance-alert')
            ).not.toBeInTheDocument();
        });
    });
});
