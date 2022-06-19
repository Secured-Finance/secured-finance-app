import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Input.stories';

const { Default } = composeStories(stories);

describe('Input component', () => {
    it('should render an input', () => {
        render(<Default />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
});
