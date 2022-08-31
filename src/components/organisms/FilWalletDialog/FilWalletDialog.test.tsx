import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './FilWalletDialog.stories';

// @ts-expect-error: this is a mock for the IntersectionObserver.
global.IntersectionObserver = class FakeIntersectionObserver {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    observe() {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    disconnect() {}
};

const { Default } = composeStories(stories);

describe('FilWalletDialog Component', () => {
    it('should render a FilWalletDialog', () => {
        render(<Default />);
    });

    it('should display three option', () => {
        render(<Default />);
        expect(screen.getAllByRole('radio')).toHaveLength(3);
        expect(screen.getAllByRole('radio')[0]).toHaveTextContent('Ledger');
        expect(screen.getAllByRole('radio')[1]).toHaveTextContent('Mnemonic');
        expect(screen.getAllByRole('radio')[2]).toHaveTextContent('PrivateKey');
    });

    it('should close after selecting an option', () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);
        screen.getByText('Mnemonic').click();
        screen.getByText('Continue').click();
        expect(onClose).toHaveBeenCalled();
    });
});
