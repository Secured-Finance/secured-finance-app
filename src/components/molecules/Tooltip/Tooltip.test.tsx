import { composeStories } from '@storybook/react';
import userEvent from '@testing-library/user-event';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Tooltip.stories';

const { Default } = composeStories(stories);

const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('Tooltip Component', () => {
    it('should render a Tooltip', () => {
        render(<Default />);
    });

    it('should render correctly', async () => {
        const wrapper = render(<Default />);

        expect(() => wrapper.unmount()).not.toThrow();
        expect(spy).toBeCalledTimes(0);
    });

    it('should show rendered information on mouseEnter event', async () => {
        render(<Default />);
        const information = screen.getByTestId('information-circle');
        await userEvent.unhover(information);
        await userEvent.hover(information);
        const tooltip = await screen.findByText(
            'If the conditions are fulfilled, the trade will be executed.',
        );
        expect(tooltip).toBeInTheDocument();
    });

    it('should remove rendered information on mouseLeave event', async () => {
        render(<Default />);
        const information = screen.getByTestId('information-circle');
        await userEvent.unhover(information);
        expect(
            screen.queryByText(
                'If the conditions are fulfilled, the trade will be executed.',
            ),
        ).not.toBeInTheDocument();
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
});
