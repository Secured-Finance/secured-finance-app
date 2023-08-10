import { composeStories } from '@storybook/react';
import { BigNumber } from 'ethers';
import { render, screen } from 'src/test-utils.js';
import * as stories from './ColorBar.stories';

const { Default } = composeStories(stories);

describe('ColorBar Component', () => {
    it('should render a ColorBar', () => {
        render(<Default />);
    });

    it('should have a width of at least 20% when value is not null', () => {
        render(
            <Default value={BigNumber.from(1)} total={BigNumber.from(1000)} />
        );
        expect(screen.getByTestId('color-bar')).toHaveStyle('width: 20%');
    });

    it('should have a width of 2px when value is zero', () => {
        render(
            <Default value={BigNumber.from(0)} total={BigNumber.from(100)} />
        );
        expect(screen.getByTestId('color-bar')).toHaveStyle('width: 2px');
    });

    it('should have a width of 300% when value is equal to total', () => {
        render(
            <Default value={BigNumber.from(100)} total={BigNumber.from(100)} />
        );
        expect(screen.getByTestId('color-bar')).toHaveStyle('width: 300%');
    });
});
