import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './OrderDisplayBox.stories';

const {
    Default,
    // WithInformationText
} = composeStories(stories);

describe('OrderDisplayBox component', () => {
    it('should render rate order display box', () => {
        render(<Default />);
        expect(screen.getByText('Fixed Rate')).toBeInTheDocument();
        expect(screen.getByText('1000')).toBeInTheDocument();
    });

    // it('should display hint when mouse enter on information circle', () => {
    //     render(<WithInformationText />);
    //     const information = screen.getByTestId('information-circle');
    //     fireEvent.mouseEnter(information);
    //     expect(screen.getByRole('tooltip')).toHaveTextContent('Some hint.');
    // });
});
