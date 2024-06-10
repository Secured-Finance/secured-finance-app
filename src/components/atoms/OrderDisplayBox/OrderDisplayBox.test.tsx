import { composeStories } from '@storybook/react';
import userEvent from '@testing-library/user-event';
import { render, screen } from 'src/test-utils.js';
import * as stories from './OrderDisplayBox.stories';

const { Default, WithInformationText } = composeStories(stories);

describe('OrderDisplayBox component', () => {
    it('should render rate order display box', () => {
        render(<Default />);
        expect(screen.getByText('Fixed Rate')).toBeInTheDocument();
        expect(screen.getByText('1000')).toBeInTheDocument();
    });

    it('should display hint when mouse enter on information circle', async () => {
        render(<WithInformationText />);
        const information = screen.getByTestId('information-circle');

        await userEvent.unhover(information);
        await userEvent.hover(information);
        const tooltip = await screen.findByText('Some hint.');
        expect(tooltip).toBeInTheDocument();
    });
});
