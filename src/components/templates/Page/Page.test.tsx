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
});
