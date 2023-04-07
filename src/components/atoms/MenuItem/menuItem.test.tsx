import { fireEvent, render, screen } from 'src/test-utils.js';

import { composeStories } from '@storybook/testing-react';
import * as stories from './MenuItem.stories';

const { Default } = composeStories(stories);

describe('MenuPopover component', () => {
    it('should render with correct text', async () => {
        render(<Default />);
        expect(screen.getByText('Example')).toBeInTheDocument();
        const menuItem = screen.getByTestId('menu-item');
        fireEvent.click(menuItem);
    });
});
