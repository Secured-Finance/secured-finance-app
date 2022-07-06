import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './TraderProTab.stories';

const { Default } = composeStories(stories);

describe('TraderProTab component', () => {
    it('should render a Tab', () => {
        render(<Default />);
        expect(screen.getByText('Trader Pro')).toBeInTheDocument();
    });
});
