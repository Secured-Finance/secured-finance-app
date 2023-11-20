import { composeStories } from '@storybook/react';
import { useRouter } from 'next/router';
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

const preloadedState = {
    blockchain: {
        chainId: 11155111,
        chainError: false,
    },
};

describe('Header component', () => {
    it('should render the header', () => {
        (useRouter as jest.Mock).mockReturnValue({
            pathname: '/',
        });
        render(<Primary />);
        expect(screen.getByText('OTC Lending')).toBeInTheDocument();
        expect(screen.getByText('Market Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Portfolio Management')).toBeInTheDocument();
        expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
        expect(screen.getByText('DEV')).toBeInTheDocument();
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

    it('should highlight the landing page when on global-itayose', () => {
        (useRouter as jest.Mock).mockReturnValue({
            pathname: '/global-itayose',
        });
        render(<Primary />);
        const textElement = screen.getByText('OTC Lending');
        expect(textElement.parentNode).toHaveClass(
            'bg-gradient-to-b from-tabGradient2 to-tabGradient1'
        );
    });

    it('should highlight the dashboard page when on dashboard page', () => {
        (useRouter as jest.Mock).mockImplementation(() => ({
            pathname: '/dashboard',
            push: jest.fn(),
        }));

        render(<Primary />);
        fireEvent.click(screen.getByText('Market Dashboard'));

        const textElement = screen.getByText('Market Dashboard');
        expect(textElement.parentNode).toHaveClass(
            'bg-gradient-to-b from-tabGradient2 to-tabGradient1'
        );
    });

    it('should highlight the landing page when on advanced page', () => {
        (useRouter as jest.Mock).mockImplementation(() => ({
            pathname: '/advanced',
            push: jest.fn(),
        }));

        render(<Primary />);
        const textElement = screen.getByText('OTC Lending');
        expect(textElement.parentNode).toHaveClass(
            'bg-gradient-to-b from-tabGradient2 to-tabGradient1'
        );
    });

    it('should render testnet header on chainError false', () => {
        (useRouter as jest.Mock).mockImplementation(() => ({
            pathname: '/',
            push: jest.fn(),
        }));

        render(<Primary />, { preloadedState });
        expect(
            screen.getByText('You are visiting Secured Finance on testnet')
        ).toBeInTheDocument();
    });
});
