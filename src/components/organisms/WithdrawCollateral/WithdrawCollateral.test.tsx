import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './WithdrawCollateral.stories';

const { Default } = composeStories(stories);

// @ts-expect-error: this is a mock for the IntersectionObserver.
global.IntersectionObserver = class FakeIntersectionObserver {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    observe() {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    disconnect() {}
};

describe('WithdrawCollateral component', () => {
    it('should display the WithdrawCollateral Modal when open', () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Withdraw Collateral')).toBeInTheDocument();

        const button = screen.getByTestId('dialog-action-button');
        expect(button).toHaveTextContent('Continue');
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should open with collateral amount 0', () => {
        render(<Default />);
        expect(screen.getByRole('textbox').getAttribute('value')).toBe('');
        expect(screen.getByRole('textbox').getAttribute('placeholder')).toBe(
            '0'
        );
    });

    it('should do nothing when collateral amount is 0 and continue button is clicked', () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);

        const button = screen.getByTestId('dialog-action-button');
        fireEvent.click(button);
        expect(onClose).not.toHaveBeenCalled();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
});
