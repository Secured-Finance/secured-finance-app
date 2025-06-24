import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils';
import * as stories from './AdvancedLendingEstimationFields.stories';

const { Default } = composeStories(stories);

describe('AdvancedLendingEstimationFields Component', () => {
    it('renders with default props', () => {
        render(<Default />);
    });
});
