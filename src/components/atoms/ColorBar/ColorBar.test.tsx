import { composeStories } from '@storybook/react';

import { render, screen } from 'src/test-utils.js';
import * as stories from './ColorBar.stories';

const { Default } = composeStories(stories);

describe('ColorBar Component', () => {
    it('should render a ColorBar', () => {
        render(<Default />);
    });

    it('should have a width of at least 5% when value is not null', () => {
        render(<Default value={BigInt(1)} total={BigInt(1000)} />);
        expect(screen.getByTestId('color-bar')).toHaveStyle('width: 5%');
    });

    it('should have a width of 2px when value is zero', () => {
        render(<Default value={BigInt(0)} total={BigInt(100)} />);
        expect(screen.getByTestId('color-bar')).toHaveStyle('width: 2px');
    });

    it('should have a width of 308% when value is equal to total', () => {
        render(<Default value={BigInt(100)} total={BigInt(100)} />);
        expect(screen.getByTestId('color-bar')).toHaveStyle('width: 308%');
    });

    it('should have a width of 5% when value is 1 and total is 1000', () => {
        render(<Default value={BigInt(1)} total={BigInt(1000)} />);
        expect(screen.getByTestId('color-bar')).toHaveStyle('width: 5%');
    });
});
