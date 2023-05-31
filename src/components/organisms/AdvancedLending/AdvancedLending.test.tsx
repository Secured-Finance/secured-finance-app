import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './AdvancedLending.stories';

const { Default } = composeStories(stories);

describe('Advanced Lending Component', () => {
    it('should render advanced lending', async () => {
        waitFor(() =>
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
            })
        );
    });

    it('should reset the amount when the user change the currency', async () => {
        const { store } = await waitFor(() =>
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
            })
        );
        expect(store.getState().landingOrderForm.amount).toEqual('0');
        fireEvent.change(screen.getByRole('textbox', { name: 'Amount' }), {
            target: { value: '1' },
        });
        expect(store.getState().landingOrderForm.amount).toEqual(
            '1000000000000000000'
        );
        fireEvent.click(screen.getByRole('button', { name: 'Filecoin' }));
        fireEvent.click(screen.getByRole('menuitem', { name: 'USDC' }));
        expect(store.getState().landingOrderForm.amount).toEqual('0');
        expect(screen.getByRole('textbox', { name: 'Amount' })).toHaveValue(
            '0'
        );
    });

    it('should reset the amount when the user change the maturity', async () => {
        const { store } = await waitFor(() =>
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
            })
        );
        expect(store.getState().landingOrderForm.amount).toEqual('0');
        fireEvent.change(screen.getByRole('textbox', { name: 'Amount' }), {
            target: { value: '1' },
        });
        expect(store.getState().landingOrderForm.amount).toEqual(
            '1000000000000000000'
        );
        fireEvent.click(screen.getByRole('button', { name: 'DEC22' }));
        fireEvent.click(screen.getByText('MAR23'));
        expect(store.getState().landingOrderForm.amount).toEqual('0');
        expect(screen.getByRole('textbox', { name: 'Amount' })).toHaveValue(
            '0'
        );
    });

    it('should show the maturity as a date for the selected maturity', async () => {
        await waitFor(() =>
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
            })
        );
        expect(
            screen.getByRole('button', { name: 'DEC22' })
        ).toBeInTheDocument();
        expect(screen.getByText('Maturity Dec 1, 2022')).toBeInTheDocument();
    });
});
