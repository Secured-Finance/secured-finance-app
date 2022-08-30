import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './FilWalletDialog.stories';

const { Default } = composeStories(stories);

describe('FilWalletDialog Component', () => {
    it('should render a FilWalletDialog', () => {
        render(<Default />);
    });
});
