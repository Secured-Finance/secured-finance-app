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
});
