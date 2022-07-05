import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CollateralUsageSection.stories';

const { Default } = composeStories(stories);

describe('CollateralUsageSection Component', () => {
    it('should render a CollateralUsageSection', () => {
        render(<Default />);
    });

    it('should display the available and the collateral usage', () => {
        render(<Default available={'100'} usage={'50%'} />);
        expect(screen.getByText('Available to borrow')).toBeInTheDocument();
        expect(screen.getByText('Collateral Usage')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
        expect(screen.getByText('50%')).toBeInTheDocument();
    });
});
