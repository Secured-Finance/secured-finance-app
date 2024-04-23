import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './WithdrawTokenTable.stories';

const { Default } = composeStories(stories);

describe('WithdrawTokenTable Component', () => {
    it('should render a WithdrawTokenTable', () => {
        render(<Default />);
    });

    it('should open the withdraw modal when the withdraw button is clicked', () => {
        render(<Default />);
        fireEvent.click(screen.getAllByRole('button', { name: 'Withdraw' })[0]);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should open the withdraw modal with the selected currency as default', () => {
        render(<Default />);
        fireEvent.click(screen.getAllByRole('button', { name: 'Withdraw' })[0]);

        expect(screen.getByText('400 Filecoin Available')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        fireEvent.click(screen.getAllByRole('button', { name: 'Withdraw' })[1]);
        expect(screen.getByText('500 Ether Available')).toBeInTheDocument();
    });
});
