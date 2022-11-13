import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './OrderInputBox.stories';

const { Default } = composeStories(stories);

describe('OrderInputBox component', () => {
    it('should render OrderInputBox', () => {
        render(<Default />);
    });
});
