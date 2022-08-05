import { fireEvent, render, screen } from 'src/test-utils.js';

import { composeStories } from '@storybook/testing-react';
import * as stories from './DepositCollateral.stories';

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

    it('should open with nothing selected', () => {
        render(<Primary />);
        screen.getAllByRole('radio').forEach(radio => {
            expect(radio).toHaveAttribute('aria-checked', 'false');
        });
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
                'Please wait while we connect. Please make sure to accept the approvals on your browser.'
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
    });
});
