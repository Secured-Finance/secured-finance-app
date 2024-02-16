import { composeStories } from '@storybook/react';
import WFIL from 'src/assets/coins/fil.svg';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Button.stories';

const {
    Primary,
    PrimaryBuy,
    PrimarySell,
    Secondary,
    SecondaryNeutral,
    Tertiary,
    TertiaryBuy,
    TertiarySell,
} = composeStories(stories);

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
        expect(button).toHaveClass('h-[2.5rem]');
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

    it('should render a green background when variant is primary-buy', async () => {
        render(<PrimaryBuy />);
        expect(screen.getByRole('button')).toHaveClass('bg-success-500');
    });

    it('should render a red background when variant is primary-sell', async () => {
        render(<PrimarySell />);
        expect(screen.getByRole('button')).toHaveClass('bg-error-500');
    });

    it('should render a blue background when variant is secondary', async () => {
        render(<Secondary />);
        expect(screen.getByRole('button')).toHaveClass('bg-primary-700');
    });

    it('should render a dark neutral background when variant is secondary-neutral', async () => {
        render(<SecondaryNeutral />);
        expect(screen.getByRole('button')).toHaveClass('bg-neutral-700');
    });

    it('should render an outlined button when variant is tertiary', async () => {
        render(<Tertiary />);
        expect(screen.getByRole('button')).toHaveClass('border-primary-50');
    });

    it('should render a green outlined button when variant is tertiary-buy', async () => {
        render(<TertiaryBuy />);
        expect(screen.getByRole('button')).toHaveClass('border-success-300');
    });

    it('should render a red outlined button when variant is tertiary-buy', async () => {
        render(<TertiarySell />);
        expect(screen.getByRole('button')).toHaveClass('border-error-300');
    });
});
