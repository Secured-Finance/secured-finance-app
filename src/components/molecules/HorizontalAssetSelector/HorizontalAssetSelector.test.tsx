import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './HorizontalAssetSelector.stories';

const { Default } = composeStories(stories);

describe('HorizontalAssetSelector Component', () => {
    it('should render a HorizontalAssetSelector', () => {
        render(<Default />);
    });
});
