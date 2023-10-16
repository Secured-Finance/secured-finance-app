import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils.js';
import * as stories from './EmergencyGlobalSettlement.stories';

const { Default } = composeStories(stories);

describe.skip('EmergencyGlobalSettlement Component', () => {
    it('should render a EmergencyGlobalSettlement', () => {
        render(<Default />);
    });
});
