import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CurrencyMaturityDropdown.stories';

const { Default } = composeStories(stories);

describe('CurrencyMaturityDropdown', () => {
    it('should render a selected market', () => {
        render(<Default />);

        expect(screen.getByText('WBTC-DEC2022')).toBeInTheDocument();
    });
});
