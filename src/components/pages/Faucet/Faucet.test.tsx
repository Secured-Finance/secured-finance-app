import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Faucet.stories';

const { Default } = composeStories(stories);

jest.mock('next/router', () => ({
    useRouter: jest.fn(() => ({
        pathname: '/',
        push: jest.fn(),
    })),
}));

jest.mock(
    'next/link',
    () =>
        ({ children }: { children: React.ReactNode }) =>
            children
);

describe('Faucet Component', () => {
    it('Mint button should be disabled when walled is not connected', () => {
        render(<Default />);
        const mintButton = screen.getAllByRole('button', {
            name: 'Mint tokens',
        })[0];
        expect(mintButton).toBeDisabled();
    });
});
