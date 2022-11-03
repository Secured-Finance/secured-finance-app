import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CoreTable.stories';

const { Default } = composeStories(stories);

describe('CoreTable Component', () => {
    it('should render a CoreTable', () => {
        render(<Default />);
    });

    it('should render a CoreTable with 2 rows and a header row', () => {
        render(<Default />);
        expect(screen.getAllByRole('row').length).toBe(3);
        expect(screen.getAllByTestId('core-table-row').length).toBe(2);
        expect(screen.getAllByTestId('core-table-header').length).toBe(1);
    });
});
