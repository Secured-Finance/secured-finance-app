import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './OrderInputBox.stories';

const { Default, Amount, Total, WithInformationText } = composeStories(stories);

describe('OrderInputBox component', () => {
    it('should render OrderInputBox', () => {
        render(<Default />);
    });

    it('should render rate orderInputBox', () => {
        render(<Default />);
        expect(screen.getByText('Fixed Rate')).toBeInTheDocument();
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
        expect(screen.getByText('1000')).toBeInTheDocument();
        expect(screen.getByText('%')).toBeInTheDocument();
    });

    it('should render amount orderInputBox', () => {
        render(<Amount />);
        expect(screen.getByText('Amount')).toBeInTheDocument();
        const input = screen.getByRole('textbox');

        expect(input.getAttribute('placeholder')).toBe('0');
        expect(input.getAttribute('value')).toBe('10');

        fireEvent.change(input, { target: { value: '100' } });
        expect(input.getAttribute('value')).toBe('100');

        fireEvent.change(input, { target: { value: '' } });
        expect(input.getAttribute('value')).toBe('');

        expect(screen.getByText('WFIL')).toBeInTheDocument();
    });

    it('should render total orderInputBox', () => {
        render(<Total />);
        expect(screen.getByText('Total')).toBeInTheDocument();
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
        expect(screen.getByText('49.2')).toBeInTheDocument();
        expect(screen.getByText('USD')).toBeInTheDocument();
    });

    it('should render a input with a name from the field', () => {
        render(<Amount field='great name' />);
        expect(
            screen.getByRole('textbox', { name: 'great name' })
        ).toBeInTheDocument();
    });

    // it('should display hint when mouse enter on information circle', () => {
    //     render(<WithInformationText />);
    //     const information = screen.getByTestId('information-circle');
    //     fireEvent.mouseEnter(information);
    //     expect(screen.getByRole('tooltip')).toHaveTextContent(
    //         'Input value from 0 to 100'
    //     );
    // });

    it('should not display hint when the input is disabled', () => {
        render(<WithInformationText disabled={true} />);
        expect(
            screen.queryByTestId('information-circle')
        ).not.toBeInTheDocument();
    });

    it('should restrict decimal places', () => {
        render(<Amount decimalPlacesAllowed={2} />);
        expect(screen.getByText('Amount')).toBeInTheDocument();
        const input = screen.getByRole('textbox');

        expect(input.getAttribute('value')).toBe('10');
        fireEvent.change(input, { target: { value: '100.2312' } });
        expect(input.getAttribute('value')).toBe('100.23');
    });

    it('should restrict amount if greater than max limit', () => {
        render(<Amount maxLimit={100} />);
        expect(screen.getByText('Amount')).toBeInTheDocument();
        const input = screen.getByRole('textbox');

        expect(input.getAttribute('value')).toBe('10');
        fireEvent.change(input, { target: { value: '101' } });
        expect(input.getAttribute('value')).toBe('10');
    });
});
