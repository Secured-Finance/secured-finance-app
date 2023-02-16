import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './InputBase.stories';

const { Default, WithValue } = composeStories(stories);

describe('test InputBase component', () => {
    it('should render input', () => {
        render(<Default />);

        const input = screen.getByRole('textbox');
        expect(input.getAttribute('placeholder')).toBe('0');
        expect(input.getAttribute('value')).toBe('');
    });

    it('should render input with value', () => {
        const onValueChange = jest.fn();
        render(<WithValue onValueChange={onValueChange} />);

        const input = screen.getByRole('textbox');
        expect(input.getAttribute('value')).toBe('50');
        fireEvent.change(input, { target: { value: '100' } });
        expect(onValueChange).toHaveBeenCalledWith(100);
        expect(input.getAttribute('value')).toBe('100');
    });

    it('should perform formatting on the value', () => {
        render(<Default />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '1000000' } });
        expect(input.getAttribute('value')).toBe('1,000,000');
    });
});
