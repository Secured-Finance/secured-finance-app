import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './LendingCard.stories';

const { Default } = composeStories(stories);

describe('LendingCard Component', () => {
    const selectFilecoin = () => {
        fireEvent.click(
            screen.getByRole('button', {
                name: 'Ethereum',
            })
        );
        fireEvent.click(screen.getByText('Filecoin'));
    };
    it('should render a LendingCard', () => {
        render(<Default />);
    });

    it('should render the component with Borrow as the default', () => {
        render(<Default />);
        expect(screen.getByText('Borrow')).toBeInTheDocument();
    });

    it('should let the user choose between ETH, FIL and USDC when clicking on the asset selector', () => {
        render(<Default />);
        expect(screen.getAllByText('Ethereum')).toHaveLength(1);
        expect(screen.queryByText('USDC')).not.toBeInTheDocument();
        expect(screen.queryByText('Filecoin')).not.toBeInTheDocument();
        fireEvent.click(
            screen.getByRole('button', {
                name: 'Ethereum',
            })
        );
        expect(screen.getAllByText('Ethereum')).toHaveLength(2);
        expect(screen.getByText('USDC')).toBeInTheDocument();
        expect(screen.getByText('Filecoin')).toBeInTheDocument();
    });

    it('should switch to Filecoin when selecting it from the option', () => {
        render(<Default />);
        selectFilecoin();
        expect(screen.getByText('Filecoin')).toBeInTheDocument();
    });
});
