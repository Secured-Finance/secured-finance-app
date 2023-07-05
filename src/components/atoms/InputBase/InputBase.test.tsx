import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from 'src/test-utils.js';
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
        fireEvent.input(input, { target: { value: '100' } });
        expect(onValueChange).toHaveBeenCalledWith(100);
        expect(input.getAttribute('value')).toBe('100');
    });

    it('should perform formatting on the value', () => {
        render(<Default />);

        const input = screen.getByRole('textbox');
        fireEvent.input(input, { target: { value: '1000000' } });
        expect(input.getAttribute('value')).toBe('1,000,000');
    });

    it('should restrict decimal places', () => {
        render(<DecimalPlacesAllowed />);

        const input = screen.getByRole('textbox');
        fireEvent.input(input, { target: { value: '100.2312' } });
        expect(input.getAttribute('value')).toBe('100.23');
    });

    it.skip('should restrict input value if greater than max limit', () => {
        render(<MaxLimit />);

        const input = screen.getByRole('textbox');
        fireEvent.input(input, { target: { value: '1001' } });
        expect(input.getAttribute('value')).toBe('100');

        fireEvent.input(input, { target: { value: '1001' } });
        expect(input.getAttribute('value')).toBe('1,000');
    });

    it('should change font size as input length changes if fontSize is provided', async () => {
        const { getByRole } = render(
            <WithValue fontSize={{ small: 5, large: 10 }} />
        );
        const input = getByRole('textbox');
        expect(input).toHaveClass('text-3xl');
        fireEvent.input(input, { target: { value: '1234' } });
        expect(input).toHaveClass('text-3xl');
        fireEvent.input(input, { target: { value: '123456' } });
        expect(input).toHaveClass('text-2xl');
        fireEvent.input(input, { target: { value: '123456789.123' } });
        expect(input).toHaveClass('text-xl');
        fireEvent.input(input, { target: { value: '1234' } });
        expect(input).toHaveClass('text-3xl');
    });

    it('should not change font size as input length changes if fontSize is not provided', async () => {
        const { getByRole } = render(<WithValue className='text-xl' />);
        const input = getByRole('textbox');
        expect(input).toHaveClass('text-xl');
        fireEvent.input(input, { target: { value: '123456789' } });
        expect(input).toHaveClass('text-xl');
        fireEvent.input(input, { target: { value: '123456789.123' } });
        expect(input).toHaveClass('text-xl');
        fireEvent.input(input, { target: { value: '12345' } });
        expect(input).toHaveClass('text-xl');
    });
});
