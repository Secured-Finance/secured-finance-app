import { composeStories } from '@storybook/react';
import packageJson from 'package.json';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Footer.stories';

const { Default } = composeStories(stories);

describe('Footer component', () => {
    describe('Status Button', () => {
        it('should render correct status link', () => {
            process.env.NEXT_PUBLIC_USE_PACKAGE_VERSION = 'true';
            render(<Default />);
            const links = screen.getAllByRole('link');
            expect(links[0]).toHaveAttribute(
                'href',
                'https://secured-finance.statuspage.io/'
            );
            expect(screen.getByText('Online')).toBeInTheDocument();
        });
    });

    describe('Version details', () => {
        it('should render footer with version', () => {
            process.env.NEXT_PUBLIC_USE_PACKAGE_VERSION = 'true';
            render(<Default />);
            expect(screen.getByText('Secured Finance App')).toBeInTheDocument();
            expect(
                screen.getByText(`v${packageJson.version}`)
            ).toBeInTheDocument();
            expect(screen.getByText('(dev)')).toBeInTheDocument();
        });

        it('should render correct release link', () => {
            process.env.NEXT_PUBLIC_USE_PACKAGE_VERSION = 'true';
            render(<Default />);
            const links = screen.getAllByRole('link');
            expect(links[1]).toHaveAttribute(
                'href',
                'https://github.com/Secured-Finance/secured-finance-app/releases'
            );
        });

        it('should render correct environment', () => {
            process.env.NEXT_PUBLIC_USE_PACKAGE_VERSION = 'true';
            process.env.SF_ENV = 'staging';
            render(<Default />);
            expect(screen.getByText('Secured Finance App')).toBeInTheDocument();
            expect(
                screen.getByText(`v${packageJson.version}`)
            ).toBeInTheDocument();
            expect(screen.getByText('(stg)')).toBeInTheDocument();
        });

        it('should render storybook as commit hash if .storybook is the commit hash even if USE_PACKAGE_VERSION is set', () => {
            process.env.NEXT_PUBLIC_USE_PACKAGE_VERSION = 'true';
            process.env.COMMIT_HASH = '.storybook';
            render(<Default />);
            expect(screen.getByText('Secured Finance App')).toBeInTheDocument();
            expect(screen.getByText('v.storybook')).toBeInTheDocument();
        });
    });
});
