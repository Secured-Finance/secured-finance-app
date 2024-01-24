import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils';
import CompactOrderInfo from './CompactOrderInfo';
import * as stories from './CompactOrderInfo.stories';

const { Default } = composeStories(stories);

describe('CompactOrderInfo', () => {
    it('renders expected elements from sample order', () => {
        render(<Default />);

        // Order side
        expect(screen.getByText('Borrow')).toBeInTheDocument();

        // Currency
        expect(screen.getByText('DAI')).toBeInTheDocument();

        // Amount
        expect(screen.getByText('1,000 DAI')).toBeInTheDocument();

        // Contract date
        expect(screen.getByText('Sep 2022')).toBeInTheDocument();

        // Price
        expect(screen.getByText('2.5%')).toBeInTheDocument();

        // APR
        expect(screen.getByText('10%')).toBeInTheDocument();
    });

    it('opens remove order dialog when cancel clicked', () => {
        render(<Default />);

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });

        fireEvent.click(cancelButton);

        expect(screen.getByText('Remove Order')).toBeInTheDocument();
    });

    it('renders null if no order data', () => {
        render(<CompactOrderInfo />);

        expect(screen.queryByText('Borrow')).not.toBeInTheDocument();
    });

    it('renders empty element if empty order data', () => {
        render(<CompactOrderInfo data={[]} />);

        expect(screen.queryByText('Borrow')).not.toBeInTheDocument();
    });
});
