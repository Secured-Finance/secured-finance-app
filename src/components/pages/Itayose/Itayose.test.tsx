import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './Itayose.stories';

const { Default } = composeStories(stories);

describe('Itayose Component', () => {
    it('should render a Itayose', () => {
        render(<Default />);
    });
});
