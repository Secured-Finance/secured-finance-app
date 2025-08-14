import { composeStories } from '@storybook/react';
import assert from 'assert';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './TermSelector.stories';

const { Default, WithTransformFunction } = composeStories(stories);

describe('TermSelector Component', () => {
    it('should render a TermSelector', () => {
        render(<Default />);
    });

    it('should not transform the option selected by default', () => {
        assert(WithTransformFunction.args?.options);
        render(<Default />);
        fireEvent.click(screen.getByRole('button'));
        const option = WithTransformFunction.args.options[3].label;
        fireEvent.click(screen.getByText(option));
        expect(
            screen.getByTestId('term-selector-transformed-value'),
        ).toHaveTextContent(option);
    });

    it('should transform the option selected with the transform function', () => {
        assert(WithTransformFunction.args?.options);
        render(<WithTransformFunction />);
        expect(
            screen.getByTestId('term-selector-transformed-value'),
        ).toHaveTextContent(
            WithTransformFunction.args.options[0].label.toUpperCase(),
        );
        fireEvent.click(screen.getByRole('button'));
        const option = WithTransformFunction.args.options[3].label;
        fireEvent.click(screen.getByText(option));
        expect(
            screen.getByTestId('term-selector-transformed-value'),
        ).toHaveTextContent(option.toUpperCase());
    });

    it('should call the onTermChange function when the term is changed', () => {
        assert(Default.args?.options);
        const onTermChange = jest.fn();
        render(<Default onTermChange={onTermChange} />);
        fireEvent.click(screen.getByRole('button'));
        const option = Default.args.options[3];
        fireEvent.click(screen.getByText(option.label));
        expect(onTermChange).toHaveBeenCalledWith(option.value);
    });
});
