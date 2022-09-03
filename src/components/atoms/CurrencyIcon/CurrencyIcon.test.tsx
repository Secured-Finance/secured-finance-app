import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CurrencyIcon.stories';

const { Default } = composeStories(stories);

describe('CurrencyIcon Component', () => {
    it('should render a CurrencyIcon', () => {
        render(<Default />);
        expect(screen.getByRole('img')).toBeInTheDocument();
    });
});
