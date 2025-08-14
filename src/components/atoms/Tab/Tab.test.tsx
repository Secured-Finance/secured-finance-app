import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Tab.stories';

const { Default, Inactive, WithSuffix } = composeStories(stories);

describe('Tab component', () => {
    it('should render an active Tab', () => {
        render(<Default />);
        const textElement = screen.getByText('Blue');
        expect(textElement.parentNode?.parentNode).toHaveClass(
            'from-tabGradient-blue-start to-tabGradient-blue-end'
        );
        expect(screen.getByTestId('Blue-tab')).toBeInTheDocument();
    });

    it('should render an inactive Tab', () => {
        render(<Inactive />);
        const textElement = screen.getByText('Inactive');
        expect(textElement.parentNode?.parentNode).not.toHaveClass(
            'from-tabGradient-blue-start to-tabGradient-blue-end'
        );
    });

    it('should render a Tab with a suffix', () => {
        render(<WithSuffix />);
        const suffixElement = screen.getByTestId('tab-suffix');
        expect(suffixElement).toBeInTheDocument();
    });

    it('should render a disabled tab', () => {
        render(<Default disabled={true} />);
        const disabledTab = screen.getByText('Blue');
        expect(disabledTab).toBeInTheDocument();
        expect(disabledTab).toHaveClass('text-neutral-400');
    });

    it('should render an inactive tab', () => {
        render(<Default active={false} />);
        const inactiveTab = screen.getByText('Blue');
        expect(inactiveTab).toBeInTheDocument();
        expect(inactiveTab).toHaveClass('text-neutral-200');
    });
});
