import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './TableHeader.stories';

const { Default, Sorting } = composeStories(stories);

describe('TableHeader Component', () => {
    it('should render a TableHeader', () => {
        render(<Default />);
    });

    it('should be clickable', () => {
        render(<Default />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });

    it('should not display a sort icon by default', () => {
        render(<Default />);
        expect(screen.queryByTestId('sorting-icons')).not.toBeInTheDocument();
    });

    it('should display the arrows when it is a sorting header', () => {
        render(<Sorting />);
        expect(screen.getByTestId('sorting-icons')).toBeInTheDocument();
    });

    it('should align the text to the right when align is right', () => {
        render(<Default align='right' />);
        expect(screen.getByTestId('table-header-wrapper')).toHaveClass(
            'justify-end'
        );
    });

    it('should not wrap the component in a div when align is not provided', () => {
        render(<Default />);
        expect(
            screen.queryByTestId('table-header-wrapper')
        ).not.toBeInTheDocument();
    });
});
