import { composeStories } from '@storybook/react';
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
            children,
);

describe('Faucet Component', () => {
    it('mint button should be disabled when walled is not connected', async () => {
        render(<Default />);
        const mintButton = await screen.findByRole('button', {
            name: 'Mint tokens',
        });
        expect(mintButton).toBeDisabled();
    });
});
