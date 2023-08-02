import { fireEvent, userEvent } from '@storybook/testing-library';
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

    describe('when the sizeDependentStyles prop is provided', () => {
        it('should apply styles as input length changes', () => {
            render(
                <WithValue
                    sizeDependentStyles={{
                        shortText: {
                            styles: 'text-3xl',
                            maxChar: 4,
                        },
                        mediumText: {
                            styles: 'text-2xl bg-moonGrey text-teal',
                            maxChar: 10,
                        },
                        longText: {
                            styles: 'text-xl',
                            maxChar: Infinity,
                        },
                    }}
                />
            );
            const input = screen.getByRole('textbox');
            expect(input).toHaveClass('text-3xl');
            fireEvent.input(input, { target: { value: '1234' } });
            expect(input).toHaveClass('text-3xl');
            fireEvent.input(input, { target: { value: '123456' } });
            expect(input).toHaveClass('text-2xl bg-moonGrey text-teal');
            fireEvent.input(input, { target: { value: '123456789.123' } });
            expect(input).toHaveClass('text-xl');
            fireEvent.input(input, { target: { value: '1234' } });
            expect(input).toHaveClass('text-3xl');
        });

        it('should not apply any style if the input value is longer than the maximum defined', () => {
            render(
                <WithValue
                    sizeDependentStyles={{
                        shortText: {
                            styles: 'text-3xl',
                            maxChar: 4,
                        },
                        mediumText: {
                            styles: 'text-2xl',
                            maxChar: 6,
                        },
                        longText: {
                            styles: 'text-xl',
                            maxChar: 8,
                        },
                    }}
                />
            );
            const input = screen.getByRole('textbox');
            expect(input).toHaveClass('text-3xl');
            fireEvent.input(input, { target: { value: '123456' } });
            expect(input).toHaveClass('text-2xl');
            fireEvent.input(input, { target: { value: '123456789' } });
            expect(input).not.toHaveClass('text-xl');
            expect(input).not.toHaveClass('text-2xl');
            expect(input).not.toHaveClass('text-3xl');
        });

        it('should apply the sortText styles if the input value is not defined', () => {
            render(
                <WithValue
                    sizeDependentStyles={{
                        shortText: {
                            styles: 'text-3xl',
                            maxChar: 4,
                        },
                        mediumText: {
                            styles: 'text-2xl',
                            maxChar: 6,
                        },
                        longText: {
                            styles: 'text-xl',
                            maxChar: 8,
                        },
                    }}
                />
            );
            const input = screen.getByRole('textbox');
            fireEvent.input(input, { target: { value: '12345678' } });
            expect(input).toHaveClass('text-xl');
            fireEvent.input(input, { target: { value: '' } });
            expect(input).toHaveClass('text-3xl');
        });
    });

    it('should not change font size as input length changes if sizeDependentStyles is not provided', async () => {
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
