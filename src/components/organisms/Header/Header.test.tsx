import { composeStories } from '@storybook/testing-react';
import { useRouter } from 'next/router';
import React from 'react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './Header.stories';

const { Primary } = composeStories(stories);

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

jest.mock(
    'next/link',
    () =>
        ({ children }: { children: React.ReactNode }) =>
            children
);

describe('Header component', () => {
    it('Should render the header', () => {
        (useRouter as jest.Mock).mockReturnValue({
            pathname: '/',
        });
        render(<Primary />);
        expect(screen.getByText('OTC Lending')).toBeInTheDocument();
        expect(screen.getByText('Market Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Portfolio Management')).toBeInTheDocument();
        expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
        expect(screen.getByText('Trader Pro')).toBeInTheDocument();
    });

    it('should highlight the landing page by default page', () => {
        (useRouter as jest.Mock).mockReturnValue({
            pathname: '/',
        });
        render(<Primary />);
        const textElement = screen.getByText('OTC Lending');
        expect(textElement.parentNode).toHaveClass(
            'bg-gradient-to-b from-tabGradient2 to-tabGradient1'
        );
    });

    it('should highlight the exchange page when on exchange page', () => {
        (useRouter as jest.Mock).mockImplementation(() => ({
            pathname: '/exchange',
            push: jest.fn(),
        }));

        render(<Primary />);
        fireEvent.click(screen.getByText('Market Dashboard'));

        const textElement = screen.getByText('Market Dashboard');
        expect(textElement.parentNode).toHaveClass(
            'bg-gradient-to-b from-tabGradient2 to-tabGradient1'
        );
    });
});
