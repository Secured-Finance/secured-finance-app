import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';

import { composeStories } from '@storybook/testing-react';
import * as stories from './WalletDialog.stories';

const { Primary } = composeStories(stories);

// @ts-expect-error: this is a mock for the IntersectionObserver.
global.IntersectionObserver = class FakeIntersectionObserver {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    observe() {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    disconnect() {}
};

const selectMetamaskOption = () => {
    const radio = screen.getAllByRole('radio');
    fireEvent.click(radio[0]);
};

describe('Wallet Dialog component', () => {
    it('should display the wallet radio group in a modal at open', () => {
        const onClose = jest.fn();
        render(<Primary onClose={onClose} />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Select Wallet Provider')).toBeInTheDocument();

        const button = screen.getByTestId('dialog-action-button');
        expect(button).toHaveTextContent('Connect Wallet');

        expect(screen.getAllByRole('radio')).toHaveLength(2);
    });

    it('should do nothing when no option is selected and button is clicked', () => {
        const onClose = jest.fn();
        render(<Primary onClose={onClose} />);

        const button = screen.getByTestId('dialog-action-button');
        fireEvent.click(button);
        expect(onClose).not.toHaveBeenCalled();
        expect(screen.getAllByRole('radio')).toHaveLength(2);
    });

    it('should move to the next step if an option was selected', () => {
        render(<Primary />);
        selectMetamaskOption();
        fireEvent.click(screen.getByTestId('dialog-action-button'));
        expect(screen.getByText('Connecting...')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Please wait while we connect. Please make sure to accept the approvals on your browser'
            )
        ).toBeInTheDocument();
    });

    it('should close the modal after the last step', async () => {
        const onClose = jest.fn();
        render(<Primary onClose={onClose} />);

        selectMetamaskOption();
        const button = screen.getByTestId('dialog-action-button');
        fireEvent.click(button);
        expect(onClose).not.toHaveBeenCalled();

        // wait for 3 seconds to make sure the modal is closed
        expect(onClose).not.toHaveBeenCalled();
        await waitFor(
            () => expect(screen.getByRole('button')).toBeInTheDocument(),
            { timeout: 4000 }
        );

        fireEvent.click(screen.getByRole('button'));
        expect(onClose).toHaveBeenCalled();
    });
});
