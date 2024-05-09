import { composeStories } from '@storybook/react';
import WFIL from 'src/assets/coins/fil.svg';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Button.stories';

const { Primary, Secondary, Tertiary } = composeStories(stories);

describe('test Button component', () => {
    it('should render button with a text', () => {
        render(<Primary />);
        const button = screen.getByText('Connect Wallet');
        expect(button).toBeInTheDocument();
        expect(button.tagName).toBe('P');
        expect(button).toHaveTextContent('Connect Wallet');
    });

    it('should render a medium button by default', () => {
        render(<Primary />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('rounded-[0.625rem] px-3.5 py-2.5');
    });

    it('should render as an anchor when used with a href', () => {
        render(<Primary href='https://google.com'>Hello</Primary>);
        const button = screen.getByRole('link');
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('href', 'https://google.com');
        expect(button).toHaveAttribute('target', '_blank');
        expect(button).toHaveTextContent('Hello');
        expect(button).toContainHTML('a');
    });

    it('should render a fullwidth button when fullWidth is true', () => {
        render(<Primary fullWidth>Hello</Primary>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('w-full');
    });

    it('should render a button with a aria-label when children is a string', () => {
        render(<Primary>Hello</Primary>);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Hello');
    });

    it('should render a button with a aria-label when children is a node', () => {
        render(<Primary>{<span>Hello</span>}</Primary>);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Button');
    });

    it('should render an icon when startIcon is set', () => {
        render(<Primary StartIcon={WFIL} />);
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should render an icon when endIcon is set', () => {
        render(<Primary EndIcon={WFIL} />);
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should render a transparent background when variant is secondary', async () => {
        render(<Secondary />);
        expect(screen.getByRole('button')).toHaveClass(
            'bg-transparent border-primary-300'
        );
    });
    it('should render an outlined button when variant is tertiary', async () => {
        render(<Tertiary />);
        expect(screen.getByRole('button')).toHaveClass('border-neutral-200');
    });
});
