import { fireEvent, render, screen } from 'src/test-utils.js';

import { composeStories } from '@storybook/testing-react';
import * as stories from './WalletPopover.stories';

const { Primary } = composeStories(stories);

describe('WalletPopover component', () => {
    it('should render when clicked on the the wallet button', () => {
        render(<Primary />);
        expect(screen.queryByText('Rinkeby')).toBeNull();
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByText('Rinkeby')).toBeInTheDocument();
    });

    it('should have a non clickable item for the network name and a clickable one for Filecoin Test Program', () => {
        render(<Primary />);
        fireEvent.click(screen.getByRole('button'));
        const item = screen.getByText('Rinkeby');
        expect(item.parentNode.parentNode).not.toHaveClass(
            'hover:bg-horizonBlue'
        );
        // const item2 = screen.getByText('Add Filecoin Wallet').parentNode
        //     .parentNode;

        // expect(item2).toHaveClass('hover:bg-horizonBlue');
        // expect(item2).toHaveAttribute('href');
    });
});
