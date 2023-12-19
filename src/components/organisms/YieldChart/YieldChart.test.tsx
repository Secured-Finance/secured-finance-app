import { composeStories } from '@storybook/react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './YieldChart.stories';

const { Default, Loading } = composeStories(stories);

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('YieldChart Component', () => {
    it('should render YieldChart', async () => {
        const { container } = render(<Default />);
        expect(await screen.findByText('$6.00')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should close and open YieldChart on button click', async () => {
        render(<Default />);
        const btn = screen.getByRole('button');
        expect(screen.getByTestId('yield-chart-component')).toHaveClass(
            'w-[640px]'
        );

        fireEvent.click(btn);
        expect(screen.getByTestId('yield-chart-component')).toHaveClass('w-0');

        fireEvent.click(btn);
        expect(screen.getByTestId('yield-chart-component')).toHaveClass(
            'w-[640px]'
        );
    });

    it('should show the spinner when loading', async () => {
        render(<Loading />);
        expect(
            screen.getByRole('alertdialog', { name: 'Loading' })
        ).toBeInTheDocument();
    });
});
