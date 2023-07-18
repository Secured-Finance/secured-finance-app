import { composeStories } from '@storybook/react';
import packageJson from 'package.json';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Footer.stories';

const { Default } = composeStories(stories);

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
});
