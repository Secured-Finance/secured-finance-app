import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Section.stories';

const { Default, Warning } = composeStories(stories);

describe('Section Component', () => {
    it('should render a Section', () => {
        render(<Default />);
    });

    it('should show warning variant', () => {
        render(<Warning />);
        expect(
            screen.getByRole('img', { name: 'warning' }),
        ).toBeInTheDocument();
        expect(screen.getByRole('alert')).toBeInTheDocument();
    });
});
