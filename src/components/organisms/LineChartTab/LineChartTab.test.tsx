import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils.js';
import * as stories from './LineChartTab.stories';

const { Default } = composeStories(stories);

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('LineChartTab Component', () => {
    it('should render LineChartTab', () => {
        render(<Default />);
    });
});
