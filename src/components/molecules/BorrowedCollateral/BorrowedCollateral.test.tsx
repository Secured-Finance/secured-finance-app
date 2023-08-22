import { composeStories } from '@storybook/react';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './BorrowedCollateral.stories';

const { Default } = composeStories(stories);

describe('BorrowedCollateral Component', () => {
    it('should render a BorrowedCollateral', () => {
        render(<Default />);
    });

    it('should toggle isBorrowedCollateral on toggling the checkbox', async () => {
        const { store } = render(<Default />);
        expect(store.getState().landingOrderForm.isBorrowedCollateral).toEqual(
            false
        );
        const checkbox = screen.getByRole('checkbox');
        await waitFor(() => {
            fireEvent.click(checkbox);
        });
        expect(store.getState().landingOrderForm.isBorrowedCollateral).toEqual(
            true
        );
        await waitFor(() => {
            fireEvent.click(checkbox);
        });
        expect(store.getState().landingOrderForm.isBorrowedCollateral).toEqual(
            false
        );
    });
});
