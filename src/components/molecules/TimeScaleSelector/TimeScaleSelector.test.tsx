// TimeScaleSelector.test.tsx
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import * as stories from './TimeScaleSelector.stories';

const { Default } = composeStories(stories);

describe('TimeScaleSelector (Storybook Testing)', () => {
    test('renders Default story', () => {
        render(<Default />);
        expect(screen.getByText('Timescales')).toBeInTheDocument();
    });
});
