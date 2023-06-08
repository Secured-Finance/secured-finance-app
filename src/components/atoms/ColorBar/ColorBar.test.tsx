import { composeStories } from '@storybook/testing-react';
import { BigNumber } from 'ethers';
import { render, screen } from 'src/test-utils.js';
import * as stories from './ColorBar.stories';

const { Default } = composeStories(stories);

describe('ColorBar Component', () => {
    it('should render a ColorBar', () => {
        render(<Default />);
    });

    it('should have always a width of at least 80%', () => {
        render(
            <Default value={BigNumber.from(0)} total={BigNumber.from(100)} />
        );
        expect(screen.getByTestId('color-bar')).toHaveStyle('width: 80%');
    });

    it('should have a width of 300% when value is equal to total', () => {
        render(
            <Default value={BigNumber.from(100)} total={BigNumber.from(100)} />
        );
        expect(screen.getByTestId('color-bar')).toHaveStyle('width: 300%');
    });
});
