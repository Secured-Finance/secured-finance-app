import { composeStories } from '@storybook/react';
import { userEvent } from '@storybook/testing-library';
import { render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './SuccessPanel.stories';

const { Default, WithTransactionHash } = composeStories(stories);

window.open = jest.fn();

describe('SuccessPanel Component', () => {
    it('should render a SuccessPanel', () => {
        render(<Default />);
    });

    it('should not have link to etherscan if txHash is not provided and tooltip should not be visible', async () => {
        render(<Default />);
        const address = screen.getByText('987654321123456789');
        expect(address).toBeInTheDocument();
        expect(address.tagName).not.toBe('BUTTON');
        await waitFor(async () => {
            await userEvent.hover(address);
        });
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it.skip('should have a link to etherscan if txHash is provided and tooltip should be visible on hover', async () => {
        render(<WithTransactionHash />);
        const address = screen.getByText('987654321123456789');
        expect(address).toBeInTheDocument();
        expect(address.tagName).toBe('BUTTON');
        address.click();

        expect(window.open).toHaveBeenCalledWith(
            'https://sepolia.etherscan.io/tx/1123456789',
            '_blank'
        );
        await waitFor(async () => {
            await userEvent.hover(address);
        });
        expect(screen.getByRole('tooltip')).toBeVisible();
    });
});
