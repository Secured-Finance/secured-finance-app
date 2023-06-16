import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './Itayose.stories';

const { Default } = composeStories(stories);

jest.mock('next/router', () => ({
    useRouter: jest.fn(() => ({
        pathname: '/',
        push: jest.fn(),
    })),
}));

jest.mock(
    'next/link',
    () =>
        ({ children }: { children: React.ReactNode }) =>
            children
);

describe('Itayose Component', () => {
    it('should render a Itayose', () => {
        render(<Default />);
    });

    it('should reset the amount when the user change the currency', async () => {
        const { store } = await waitFor(() => render(<Default />));
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
});
