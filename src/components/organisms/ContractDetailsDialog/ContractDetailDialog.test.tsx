import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils.js';
import * as stories from './ContractDetailDialog.stories';

const { Default } = composeStories(stories);

describe('ContractDetailDialog Component', () => {
    it('should render a ContractDetailDialog', () => {
        render(<Default />);
    });
});
