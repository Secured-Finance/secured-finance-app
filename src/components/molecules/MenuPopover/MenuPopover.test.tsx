import { fireEvent, render, screen } from 'src/test-utils.js';

import { composeStories } from '@storybook/testing-react';
import * as stories from './MenuPopover.stories';

const { Default } = composeStories(stories);

describe('MenuPopover component', () => {
    it('should have a button with text More', () => {
        render(<Default />);
        const button = screen.getByRole('button', { name: 'More' });
        expect(button).toBeInTheDocument();
    });
    it('should render when clicked on the More... button', async () => {
        render(<Default />);
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button'));
        expect(await screen.findByRole('menu')).toBeInTheDocument();
        expect(screen.queryAllByRole('menuitem')).toHaveLength(5);
    });
});
