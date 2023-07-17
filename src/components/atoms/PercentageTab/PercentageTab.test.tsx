import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './PercentageTab.stories';

const { Default, NotActiveTab } = composeStories(stories);

describe('PercentageTab component', () => {
    it('should render active PercentageTab', () => {
        render(<Default />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('border-none bg-neutral-8 text-neutral-2');
    });

    it('should render inactive PercentageTab', () => {
        render(<NotActiveTab />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('border-2 border-neutral-3 text-neutral-4');
    });
});
