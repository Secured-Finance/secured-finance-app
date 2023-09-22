import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils.js';
import * as stories from './Alert.stories';

const { Default } = composeStories(stories);

describe('Alert Component', () => {
    it('should render a Alert', () => {
        render(<Default />);
    });
});
