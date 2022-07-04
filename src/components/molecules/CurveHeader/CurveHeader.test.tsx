import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './CurveHeader.stories';

const { Default } = composeStories(stories);

describe('test CurveHeader component', () => {
    it('should render CurveHeader', () => {
        render(<Default />);
    });
});
