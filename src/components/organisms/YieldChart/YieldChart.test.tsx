import { composeStories } from '@storybook/testing-react';
import {
    fireEvent,
    queries,
    render,
    RenderResult,
    screen,
    waitFor,
} from 'src/test-utils.js';
import * as stories from './YieldChart.stories';

const { Default, Loading } = composeStories(stories);

describe('YieldChart Component', () => {
    it.skip('should render YieldChart', async () => {
        let ag: RenderResult<typeof queries, HTMLElement>;
        await waitFor(async () => {
            ag = await render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
            });
        }).then(() => {
            expect(ag.baseElement).toMatchSnapshot();
        });
    });

    it('should close and open YieldChart on button click', async () => {
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
        });
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
        render(<Loading />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
        });
        expect(
            screen.getByRole('alertdialog', { name: 'Loading' })
        ).toBeInTheDocument();
    });
});
