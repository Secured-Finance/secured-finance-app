import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CurveHeaderTotal.stories';

const { Default } = composeStories(stories);

describe('test CurveHeaderTotal component', () => {
    it('should render CurveHeaderTotal with header and footer', () => {
        render(<Default />);
        expect(screen.getByText('Total Borrow (Asset)')).toBeInTheDocument();
        expect(screen.getByText('80,000,009 FIL')).toBeInTheDocument();
    });
});
