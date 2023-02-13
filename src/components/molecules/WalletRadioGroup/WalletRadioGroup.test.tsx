import { fireEvent, render, screen } from 'src/test-utils.js';

import { composeStories } from '@storybook/testing-react';
import * as stories from './WalletRadioGroup.stories';

const { Default } = composeStories(stories);

describe('Wallet Dialog component', () => {
    it('should shows two options in a radio button with only one being able to be selected at the same time', () => {
        render(<Default />);

        const radio = screen.getAllByRole('radio');
        expect(radio).toHaveLength(2);
        expect(radio[0]).toHaveTextContent('Metamask');
        expect(radio[0]).toHaveAttribute('aria-checked', 'false');
        expect(radio[1]).toHaveTextContent('WalletConnect');
        expect(radio[1]).toHaveAttribute('aria-checked', 'false');

        fireEvent.click(radio[0]);
        expect(radio[0]).toHaveAttribute('aria-checked', 'true');
        expect(radio[1]).toHaveAttribute('aria-checked', 'false');

        fireEvent.click(radio[1]);
        expect(radio[0]).toHaveAttribute('aria-checked', 'false');
        expect(radio[1]).toHaveAttribute('aria-checked', 'true');
    });
});
