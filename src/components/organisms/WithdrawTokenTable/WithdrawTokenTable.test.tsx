import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils.js';
import * as stories from './WithdrawTokenTable.stories';

const { Default } = composeStories(stories);

describe('WithdrawTokenTable Component', () => {
    it('should render a WithdrawTokenTable', () => {
        render(<Default />);
    });
});
