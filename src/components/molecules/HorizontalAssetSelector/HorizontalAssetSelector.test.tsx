import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
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
        fireEvent.click(screen.getByRole('button', { name: 'WBTC' }));
        fireEvent.click(screen.getByRole('menuitem', { name: 'USDC' }));
        expect(onAssetChange).toHaveBeenNthCalledWith(2, 'USDC');
    });
});
