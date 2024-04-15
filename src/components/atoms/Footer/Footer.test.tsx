import { composeStories } from '@storybook/react';
import packageJson from 'package.json';
import { render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './Footer.stories';

const { Default, NotConnected } = composeStories(stories);

describe('Footer component', () => {
    it('should render footer', () => {
        process.env.NEXT_PUBLIC_USE_PACKAGE_VERSION = 'true';
        render(<Default />);
        expect(
            screen.getByText(`Secured Finance v${packageJson.version}`)
        ).toBeInTheDocument();
        expect(screen.getByText('(dev)')).toBeInTheDocument();
    });

    it('should render correct environment', () => {
        process.env.NEXT_PUBLIC_USE_PACKAGE_VERSION = 'true';
        process.env.SF_ENV = 'staging';
        render(<Default />);
        expect(
            screen.getByText(`Secured Finance v${packageJson.version}`)
        ).toBeInTheDocument();
        expect(screen.getByText('(stg)')).toBeInTheDocument();
    });

    it('should render storybook as commit hash if .storybook is the commit hash even if USE_PACKAGE_VERSION is set', () => {
        process.env.NEXT_PUBLIC_USE_PACKAGE_VERSION = 'true';
        process.env.COMMIT_HASH = '.storybook';
        render(<Default />);
        expect(
            screen.getByText(`Secured Finance v.storybook`)
        ).toBeInTheDocument();
    });

    it('should show connected connection status circle', async () => {
        render(<Default />);
        await waitFor(() =>
            expect(screen.getByTestId('connection-status')).toHaveClass(
                'bg-green'
            )
        );
    });

    it('should show disconnected connection status circle when wallet is connected but chainError', async () => {
        render(<Default />, {
            preloadedState: {
                blockchain: {
                    chainError: true,
                },
            },
        });
        await waitFor(() =>
            expect(screen.getByTestId('connection-status')).toHaveClass(
                'bg-red'
            )
        );
    });

    it('should show disconnected connection status circle when wallet is not connected', async () => {
        render(<NotConnected />);
        await waitFor(() =>
            expect(screen.getByTestId('connection-status')).toHaveClass(
                'bg-red'
            )
        );
    });
});
