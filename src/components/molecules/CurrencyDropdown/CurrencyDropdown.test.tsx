import { composeStories } from '@storybook/react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, within } from 'src/test-utils.js';
import * as stories from './CurrencyDropdown.stories';

const { Default } = composeStories(stories);

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('CurrencyDropdown', () => {
    it('renders the dropdown with the correct options', () => {
        render(<Default />);
        expect(
            screen.getByRole('button', {
                name: 'WBTC',
            })
        ).toBeInTheDocument;
    });

    it('calls the onChange function when an option is selected', () => {
        const onChange = jest.fn();
        render(<Default onChange={onChange} />);
        const dropdown = screen.getByRole('button', {
            name: 'WBTC',
        });
        fireEvent.click(dropdown);
        fireEvent.click(screen.getByRole('menuitem', { name: 'ETH' }));
        expect(onChange).toHaveBeenCalledWith('ETH');
    });

    it.skip('displays a delisting chip for delisted currencies', async () => {
        render(<Default />);
        const dropdown = screen.getByRole('button', {
            name: 'WBTC',
        });
        fireEvent.click(dropdown);
        expect(
            await within(
                screen.getByRole('menuitem', { name: 'WBTC' })
            ).findByText('Delisting')
        ).toBeInTheDocument();

        expect(
            await within(
                screen.getByRole('menuitem', { name: 'WFIL' })
            ).findByText('Delisting')
        ).toBeInTheDocument();

        expect(
            screen.getByRole('menuitem', { name: 'ETH' })
        ).not.toHaveTextContent('Delisting');
        expect(
            screen.getByRole('menuitem', { name: 'USDC' })
        ).not.toHaveTextContent('Delisting');
    });

    it('should display currency icon', async () => {
        render(<Default />);
        const dropdown = screen.getByRole('button', {
            name: 'WBTC',
        });
        fireEvent.click(dropdown);
        expect(
            await within(
                screen.getByRole('menuitem', { name: 'WBTC' })
            ).findByRole('img')
        ).toBeInTheDocument();
    });
});
