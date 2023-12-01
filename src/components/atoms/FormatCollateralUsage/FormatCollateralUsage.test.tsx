import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './FormatCollateralUsage.stories';

const { Default, WithMaxValue } = composeStories(stories);

describe('FormatCollateralUsage Component', () => {
    it('should render collateral usage with expected colors', () => {
        render(<Default />);
        expect(screen.getByText('50%')).toBeInTheDocument();
        expect(screen.getByText('67%')).toBeInTheDocument();
        expect(screen.getByText('67%')).toHaveClass('text-progressBarEnd');
    });

    it('should render color of final usage according to max value if max value is lesser than final', () => {
        render(<WithMaxValue />);
        expect(screen.getByText('50%')).toBeInTheDocument();
        expect(screen.getByText('67%')).toBeInTheDocument();
        expect(screen.getByText('67%')).toHaveClass('text-progressBarVia');
    });

    it('should not render color of final usage according to max value if max value is greater than final', () => {
        render(<WithMaxValue maxValue={9900} />);
        expect(screen.getByText('50%')).toBeInTheDocument();
        expect(screen.getByText('67%')).toBeInTheDocument();
        expect(screen.getByText('67%')).toHaveClass('text-progressBarEnd');
    });
});
