import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import { LinkList } from 'src/utils';
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
        expect(screen.queryAllByRole('menuitem')).toHaveLength(LinkList.length);
    });
});
