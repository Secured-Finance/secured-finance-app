import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './HorizontalAssetSelector.stories';

const { Default } = composeStories(stories);

describe('HorizontalAssetSelector Component', () => {
    it('should render a HorizontalAssetSelector', () => {
        render(<Default />);
    });

    it('should call onAssetChange when the user change the asset', () => {
        const onAssetChange = jest.fn();
        render(<Default onAssetChange={onAssetChange} />);
        expect(onAssetChange).toHaveBeenNthCalledWith(1, 'WBTC');
        screen.getByRole('button', { name: 'WBTC' }).click();
        screen.getByRole('menuitem', { name: 'USDC' }).click();
        expect(onAssetChange).toHaveBeenNthCalledWith(2, 'USDC');
    });
});
