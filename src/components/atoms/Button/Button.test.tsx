import { composeStories } from '@storybook/react';
import WFIL from 'src/assets/coins/fil.svg';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Button.stories';

const { Default, Outlined } = composeStories(stories);

describe('test Button component', () => {
    it('should render button with a text', () => {
        render(<Default />);
        const button = screen.getByText('Connect Wallet');
        expect(button).toBeInTheDocument();
        expect(button).toContainHTML('button');
    });

    it('should render a medium button by default', () => {
        render(<Default />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('h-12');
    });

    it('should render as an anchor when used with a href', () => {
        render(<Default href='https://google.com'>Hello</Default>);
        const button = screen.getByRole('link');
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('href', 'https://google.com');
        expect(button).toHaveAttribute('target', '_blank');
        expect(button).toHaveTextContent('Hello');
        expect(button).toContainHTML('a');
    });

    it('should render a fullwidth button when fullWidth is true', () => {
        render(<Default fullWidth>Hello</Default>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('w-full');
    });

    it('should render a button with a aria-label when children is a string', () => {
        render(<Default>Hello</Default>);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Hello');
    });

    it('should render a button with a aria-label when children is a node', () => {
        render(<Default>{<span>Hello</span>}</Default>);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Button');
    });

    it('should render an icon when startIcon is set', () => {
        render(<Default StartIcon={WFIL} />);
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should render an icon when endIcon is set', () => {
        render(<Default EndIcon={WFIL} />);
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should render an outlined button when variant is outlined', async () => {
        render(<Outlined />);
        expect(screen.getByRole('button')).toHaveClass(
            'enabled:border-2 enabled:border-slateGray enabled:text-neutral-8 enabled:hover:border-none enabled:hover:bg-neutral-8 enabled:hover:text-neutral-2 disabled:bg-neutral-8 disabled:text-neutral-2'
        );
    });
});
