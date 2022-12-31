import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './TableContractCell.stories';

const { Default } = composeStories(stories);

describe('TableContractCell Component', () => {
    it('should render a TableContractCell', () => {
        render(<Default />);
    });
});
