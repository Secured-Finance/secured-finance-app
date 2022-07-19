import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './PortfolioManagementTable.stories';

const { Default } = composeStories(stories);

describe('test PortfolioManagmentcomponent', () => {
    it('should render Portfolio Tab', () => {
        render(<Default />);
        const item = screen.getByTestId('portfolio-management-table');
        expect(item.childElementCount).toEqual(4);
    });
});
