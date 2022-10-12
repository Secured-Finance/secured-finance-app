import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';

import { composeStories } from '@storybook/testing-react';
import * as stories from './WalletPopover.stories';

const { Primary } = composeStories(stories);
// @ts-expect-error: this is a mock for the IntersectionObserver.
global.IntersectionObserver = class FakeIntersectionObserver {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    observe() {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    disconnect() {}
};

describe('WalletPopover component', () => {
    it('should render when clicked on the the wallet button', () => {
        render(<Primary />);
        expect(screen.queryByText('Goerli')).toBeNull();
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByText('Goerli')).toBeInTheDocument();
    });

    it('should have a default cursor if there is no onclick action', () => {
        render(<Primary />);
        fireEvent.click(screen.getByRole('button'));
        screen.getAllByRole('button', { name: 'Menu Item' }).forEach(button => {
            if (!button.hasAttribute('onclick')) {
                expect(button).toHaveStyle('cursor: default');
            } else {
                expect(button).toHaveStyle('cursor: pointer');
            }
        });
    });

    it('should close the popover when clicking on finish KYC', async () => {
        render(<Primary isKYC={false} />);
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('Finish KYC'));
        await waitFor(() => {
            expect(screen.queryByText('Goerli')).toBeNull();
        });
    });

    it('should show that the account if verified is the KYC is done', () => {
        render(<Primary isKYC={true} />);
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByText('Account Verified')).toBeInTheDocument();
    });
});
