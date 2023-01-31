import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Page.stories';

const { Default } = composeStories(stories);

describe('Page Component', () => {
    it('should render a Page', () => {
        render(<Default />);
    });

    it('should render a Page with a title component', () => {
        render(<Default titleComponent={<div>title component</div>} />);
        screen.getByText('title component');
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
});
