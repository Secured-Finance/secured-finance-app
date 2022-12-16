import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './AdvancedLendingOrganism.stories';

const { Default } = composeStories(stories);

describe('AdvancedLendingOrganism Component', () => {
    it('should render AdvancedLendingOrganism', () => {
        render(<Default />);
    });
});
