import { composeStories } from '@storybook/testing-react';
import { BigNumber } from 'ethers';
import { render, screen } from 'src/test-utils.js';
import * as stories from './ColorBar.stories';

const { Default } = composeStories(stories);

describe('ColorBar Component', () => {
    it('should render a ColorBar', () => {
        render(<Default />);
    });

    it('should have always a width of at least 3%', () => {
        render(
            <Default value={BigNumber.from(1)} total={BigNumber.from(100)} />
        );
        expect(screen.getByTestId('color-bar')).toHaveStyle('width: 3%');
    });

    it('should have a width of 90% when value is equal to total', () => {
        render(
            <Default value={BigNumber.from(100)} total={BigNumber.from(100)} />
        );
        expect(screen.getByTestId('color-bar')).toHaveStyle('width: 90%');
    });
});
