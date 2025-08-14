import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Counter.stories';

const { Default, OnlyNumber, OnlyPrefix, OnlySuffix } = composeStories(stories);

describe('test Counter component', () => {
    it('should render default counter', async () => {
        render(<Default />);
        expect(
            await screen.findByText('$12.23M', undefined, { timeout: 3000 })
        ).toBeInTheDocument();
    });

    it('should render only number counter', async () => {
        render(<OnlyNumber />);
        expect(
            await screen.findByText('14.23', undefined, { timeout: 3000 })
        ).toBeInTheDocument();
    });

    it('should render only prefix counter', async () => {
        render(<OnlyPrefix />);
        expect(
            await screen.findByText('$4,000.91', undefined, { timeout: 3000 })
        ).toBeInTheDocument();
    });

    it('should render only suffix counter', async () => {
        render(<OnlySuffix />);
        expect(
            await screen.findByText('40.20K', undefined, { timeout: 3000 })
        ).toBeInTheDocument();
    });
});
