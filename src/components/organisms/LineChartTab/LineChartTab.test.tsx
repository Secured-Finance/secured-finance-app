import { composeStories } from '@storybook/react';
import * as ChartJS from 'chart.js';
import { fireEvent, render } from 'src/test-utils.js';
import * as stories from './LineChartTab.stories';

const { Default } = composeStories(stories);

describe('LineChartTab Component', () => {
    it('should render LineChartTab', () => {
        const { container } = render(<Default />);
        const canvas = container.querySelector('canvas');
        const chartInstance = ChartJS.Chart.instances[0];

        jest.spyOn(chartInstance, 'getElementsAtEventForMode').mockReturnValue([
            {
                index: 1,
                element: {} as ChartJS.Element,
                datasetIndex: 0,
            },
        ]);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        fireEvent.click(canvas!);
    });
});
