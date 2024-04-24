import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
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

    it('should remove rendered information on mouseLeave event', () => {
        render(<Default />);
        const information = screen.getByTestId('information-circle');
        fireEvent.mouseEnter(information);
        fireEvent.mouseLeave(information);

        expect(
            screen.queryByText(
                'If the conditions are fulfilled, the trade will be executed.'
            )
        ).not.toBeInTheDocument();
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
});
