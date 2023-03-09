import { fireEvent, render, screen } from 'src/test-utils.js';

import { composeStories } from '@storybook/testing-react';
import * as stories from './WalletPopover.stories';

const { Default } = composeStories(stories);

describe('WalletPopover component', () => {
    it('should render when clicked on the the wallet button', () => {
        render(<Default />);
        expect(screen.queryByText('Goerli')).toBeNull();
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByText('Goerli')).toBeInTheDocument();
    });

    it('should have a default cursor if there is no onclick action', () => {
        render(<Default />);
        fireEvent.click(screen.getByRole('button'));
        screen.getAllByRole('button', { name: 'Menu Item' }).forEach(button => {
            if (!button.hasAttribute('onclick')) {
                expect(button).toHaveStyle('cursor: default');
            } else {
                expect(button).toHaveStyle('cursor: pointer');
            }
        });
    });
});
