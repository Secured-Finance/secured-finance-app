import { userEvent } from '@storybook/testing-library';
import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './InputBase.stories';

const { Default, WithValue, DecimalPlacesAllowed, MaxLimit } =
    composeStories(stories);

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
        userEvent.clear(input);
        userEvent.type(input, '100');
        expect(onValueChange).toHaveBeenCalledWith(100);
        expect(input.getAttribute('value')).toBe('100');
    });

    it('should perform formatting on the value', () => {
        render(<Default />);

        const input = screen.getByRole('textbox');
        userEvent.clear(input);
        userEvent.type(input, '1000000');
        expect(input.getAttribute('value')).toBe('1,000,000');
    });

    it('should restrict decimal places', () => {
        render(<DecimalPlacesAllowed />);

        const input = screen.getByRole('textbox');
        userEvent.clear(input);
        userEvent.type(input, '100.2312');
        expect(input.getAttribute('value')).toBe('100.23');
    });

    it('should restrict input value if greater than max limit', () => {
        render(<MaxLimit />);

        const input = screen.getByRole('textbox');
        userEvent.clear(input);
        userEvent.type(input, '1001');
        expect(input.getAttribute('value')).toBe('100');

        userEvent.type(input, '10001');
        expect(input.getAttribute('value')).toBe('1,000');
    });
});
