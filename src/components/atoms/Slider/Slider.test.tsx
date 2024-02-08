import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './Slider.stories';

const { Default } = composeStories(stories);

describe('test Slider component', () => {
    it('should render Slider', () => {
        render(<Default />);
    });

    it('should change value when a slider is moved', () => {
        const onChangeMock = jest.fn();
        render(<Default onChange={onChangeMock} />);

        const slider = screen.getByRole('slider');
        fireEvent.change(slider, { target: { value: 100 } });
        expect(onChangeMock).toHaveBeenCalledWith(100);
    });

    it('should not allow clicking when disabled', () => {
        const onChangeMock = jest.fn();
        render(<Default disabled value={25} />);

        const slider = screen.getByRole('slider');
        expect(slider).toBeDisabled();

        fireEvent.click(slider);
        expect(onChangeMock).not.toHaveBeenCalled();
    });
});
