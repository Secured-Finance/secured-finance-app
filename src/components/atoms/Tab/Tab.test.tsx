import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Tab.stories';

const { Default, Inactive } = composeStories(stories);

describe('Tab component', () => {
    it('should render an active Tab', () => {
        render(<Default />);
        const textElement = screen.getByText('Blue');
        expect(textElement.parentNode?.parentNode).toHaveClass(
            'from-tabGradient-blue-start to-tabGradient-blue-end light:from-tabGradient-blue-startLight light:to-tabGradient-blue-endLight'
        );
        expect(screen.getByTestId('Blue-tab')).toBeInTheDocument();
    });

    it('should render an inactive Tab', () => {
        render(<Inactive />);
        const textElement = screen.getByText('Inactive');
        expect(textElement.parentNode?.parentNode).not.toHaveClass(
            'from-tabGradient-blue-start to-tabGradient-blue-end light:from-tabGradient-blue-startLight light:to-tabGradient-blue-endLight'
        );
    });
});
