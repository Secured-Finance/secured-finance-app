import { composeStories } from '@storybook/react';
import WFIL from 'src/assets/coins/fil.svg';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Button.stories';

const { Default, Tertiary } = composeStories(stories);

describe('test Button component', () => {
    it('should render button with a text', () => {
        render(<Default />);
        const button = screen.getByText('Connect Wallet');
        expect(button).toBeInTheDocument();
        expect(button.tagName).toBe('P');
        expect(button).toHaveTextContent('Connect Wallet');
    });

    it('should render a medium button by default', () => {
        render(<Default />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('h-[2.5rem]');
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

    it('should render an outlined button when variant is tertiary', async () => {
        render(<Tertiary />);
        expect(screen.getByRole('button')).toHaveClass(
            'border-primary-50 bg-transparent'
        );
    });
});
