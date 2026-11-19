import { composeStories } from '@storybook/react';
import packageJson from 'package.json';
import { mockRuntimeConfig } from 'src/stories/mocks/runtimeConfigMock';
import { render, screen } from 'src/test-utils.js';
import { RuntimeConfig } from 'src/utils';
import * as stories from './Footer.stories';

const { Default } = composeStories(stories);

describe('Footer component', () => {
    describe('Status Button', () => {
        it('should render correct status link', async () => {
            process.env.NEXT_PUBLIC_USE_PACKAGE_VERSION = 'true';
            render(<Default />);
            expect(await screen.findByText('Online')).toBeInTheDocument();
            expect(
                screen.getByRole('link', { name: 'Status Page' })
            ).toHaveAttribute('href', 'https://secured-finance.statuspage.io/');
        });

        it('should hide the status until the config loads', () => {
            global.fetch = jest.fn(
                () => new Promise<Response>(() => undefined)
            );
            render(<Default />);
            expect(screen.queryByText('Online')).not.toBeInTheDocument();
            expect(
                screen.getByRole('link', { name: 'Status Page', hidden: true })
            ).toHaveClass('invisible');
        });

        it('should render an unknown status when the config cannot be loaded', async () => {
            global.fetch = jest.fn().mockRejectedValue(new Error('network'));
            render(<Default />);
            expect(
                await screen.findByText('Unknown', {}, { timeout: 3000 })
            ).toBeInTheDocument();
            expect(screen.queryByText('Online')).not.toBeInTheDocument();
        });

        it('should render an unknown status when the config is invalid', async () => {
            mockRuntimeConfig({
                pauseAlert: { message: 123 },
            } as unknown as RuntimeConfig);
            render(<Default />);
            expect(
                await screen.findByText('Unknown', {}, { timeout: 3000 })
            ).toBeInTheDocument();
            expect(screen.queryByText('Online')).not.toBeInTheDocument();
        });
    });

    describe('Protocol paused', () => {
        it('should render the temporarily paused status when a pause message is set', async () => {
            mockRuntimeConfig({ pauseAlert: { message: 'Paused' } });
            render(<Default />);
            expect(
                await screen.findByText('Temporarily Paused')
            ).toBeInTheDocument();
            expect(screen.queryByText('Online')).not.toBeInTheDocument();
        });

        it('should render the online status when the pause message is blank', async () => {
            mockRuntimeConfig({ pauseAlert: { message: '   ' } });
            render(<Default />);
            expect(await screen.findByText('Online')).toBeInTheDocument();
        });
    });

    describe('Version details', () => {
        it('should render footer with version', () => {
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
    });
});
