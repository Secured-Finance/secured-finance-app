import { composeStories } from '@storybook/react';
import userEvent from '@testing-library/user-event';
import { render, screen } from 'src/test-utils.js';
import * as stories from './TableHeader.stories';

const { Default, Sorting, TitleHint } = composeStories(stories);

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

    it('should center the text by default', () => {
        render(<Default />);
        expect(screen.getByTestId('table-header-wrapper')).toHaveClass(
            'justify-center',
        );
    });

    it('should add horizontal padding by default', () => {
        render(<Default />);
        expect(screen.getByTestId('table-header-wrapper')).toHaveClass('px-2');
    });

    it('should remove horizontal padding when horizontalPadding is falsy', () => {
        render(<Default horizontalPadding={false} />);
        expect(screen.getByTestId('table-header-wrapper')).not.toHaveClass(
            'px-3',
        );
    });

    it('should align the text to the right when align is right', () => {
        render(<Default align='right' />);
        expect(screen.getByTestId('table-header-wrapper')).toHaveClass(
            'justify-end',
        );
    });

    it('should display title hint on mouse enter as a tooltip', async () => {
        render(<TitleHint />);
        const button = screen.getByRole('button');
        await userEvent.unhover(button);
        await userEvent.hover(button);
        const tooltip = await screen.findByText('This is a title hint.');
        expect(tooltip).toBeInTheDocument();
    });

    it('should not display title hint on mouse out', async () => {
        render(<TitleHint />);
        const button = screen.getByRole('button');

        await userEvent.unhover(button);

        expect(
            screen.queryByText('This is a title hint.'),
        ).not.toBeInTheDocument();
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
});
