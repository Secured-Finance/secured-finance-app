import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Page.stories';

const { Default, WithMultipleChildren } = composeStories(stories);

describe('Page Component', () => {
    it('should render a Page', () => {
        render(<Default />);
    });

    it('should render a Page with a title', () => {
        render(<Default title='title' />);
        screen.getByText('title');
    });

    it('should add data-testid attribute to the page if name is entered', () => {
        render(<Default name='name' />);
        screen.getByTestId('name');
    });

    it('should not have data-testid attribute to the page if name is not entered', () => {
        render(<Default />);
        expect(screen.queryByTestId('name')).toBeNull();
    });

    it('should render a Page with multiple children', () => {
        render(<WithMultipleChildren />);
        screen.getByText('Child 1');
        screen.getByText('Child 2');
        screen.getByText('Child 3');
    });
});
