import { composeStories } from '@storybook/react';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './TableActionMenu.stories';

const { Default, Open } = composeStories(stories);

describe('TableActionMenu Component', () => {
    it('should render a TableActionMenu', () => {
        render(<Default />);
    });

    it('should open the menu when clicking on the button', () => {
        render(<Default />);
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should call the onClick argument when clicked', () => {
        const onClick = jest.fn();
        render(<Default items={[{ text: 'test', onClick: onClick }]} />);

        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('test'));
        expect(onClick).toHaveBeenCalled();
    });

    it('should render a disabled button if disabled is true', async () => {
        render(<Open />);
        waitFor(() => {
            const button = screen.getByText('disabled');
            expect(button).toBeDisabled();
            expect(button).toHaveClass('text-slateGray');
        });
    });
});
