import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './AdvancedLending.stories';

const { Default } = composeStories(stories);

describe('Advanced Lending Component', () => {
    it('should render advanced lending', () => {
        render(<Default />);
    });

    it('should reset the amount when the user change the currency', () => {
        const { store } = render(<Default />);
        expect(store.getState().landingOrderForm.amount).toEqual('0');
        fireEvent.change(screen.getByRole('textbox', { name: 'Amount' }), {
            target: { value: '1' },
        });
        expect(store.getState().landingOrderForm.amount).toEqual(
            '1000000000000000000'
        );
        fireEvent.click(screen.getByText('Filecoin'));
        fireEvent.click(screen.getByText('USDC'));
        expect(store.getState().landingOrderForm.amount).toEqual('0');
        expect(screen.getByRole('textbox', { name: 'Amount' })).toHaveValue(
            '0'
        );
    });
});
