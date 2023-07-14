import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Separator.stories';

const { Default, Primary } = composeStories(stories);

describe('Separator Component', () => {
    it('should render a Separator', () => {
        render(<Default />);
        expect(screen.getByTestId('separator')).toHaveClass(
            'border-b border-white-5'
        );
    });

    it('should render custom color Separator with vertical orientation', () => {
        render(<Primary />);
        expect(screen.getByTestId('separator')).toHaveClass(
            'border-l border-moonGrey border-opacity-30'
        );
    });
});
