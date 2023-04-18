import { composeStories } from '@storybook/testing-react';
import packageJson from 'package.json';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Footer.stories';

const { Default } = composeStories(stories);

describe('Footer component', () => {
    it('should render footer', () => {
        render(<Default />);
        expect(
            screen.getByText(`Secured Finance v${packageJson.version}`)
        ).toBeInTheDocument();
        expect(screen.getByText('(dev)')).toBeInTheDocument();
    });

    it('should render correct environment', () => {
        process.env.SF_ENV = 'staging';
        render(<Default />);
        expect(
            screen.getByText(`Secured Finance v${packageJson.version}`)
        ).toBeInTheDocument();
        expect(screen.getByText('(stg)')).toBeInTheDocument();
    });
});
