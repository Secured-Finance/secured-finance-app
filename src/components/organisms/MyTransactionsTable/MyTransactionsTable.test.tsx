import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils.js';
import * as stories from './MyTransactionsTable.stories';

const { Default } = composeStories(stories);

describe('MyTransactionsTable Component', () => {
    it('should render a MyTransactionsTable', () => {
        render(<Default />);
    });
});
