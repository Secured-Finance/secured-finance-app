import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './TitlePage.stories';

const { Default } = composeStories(stories);

describe('TitlePage Component', () => {
    it('should render a TitlePage', () => {
        render(<Default />);
    });

    it('should render a TitlePage with a title component', () => {
        render(<Default titleComponent={<div>title component</div>} />);
        screen.getByText('title component');
    });

    it('should render a TitlePage with a title', () => {
        render(<Default title='title' />);
        screen.getByText('title');
    });
});
