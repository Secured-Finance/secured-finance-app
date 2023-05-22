import { MockedProvider } from '@apollo/client/testing';
import '@storybook/addon-console';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { Provider } from 'react-redux';
import 'src/assets/css/index.css';
import { withPerformance } from 'storybook-addon-performance';
import store from './../src/store';
import { MockSecuredFinanceProvider } from './../src/stories/mocks/MockSecuredFinanceProvider';
import { withMockDate } from './decorators';

export const parameters = {
    actions: { argTypesRegex: '^on.*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },

    viewport: {
        viewports: INITIAL_VIEWPORTS,
        defaultViewport: 'responsive',
    },

    backgrounds: {
        values: [
            {
                name: 'black',
                value: '#000',
            },
            {
                name: 'white',
                value: '#fff',
            },
            {
                name: 'figma',
                value: '#19305C',
            },
            {
                name: 'blue',
                value: '#174e7a',
            },
        ],
    },

    apolloClient: {
        MockedProvider,
    },
    // Date is set to 1st Feb 2022 for all stories
    // This can be overridden in individual stories
    date: { value: new Date('2022-02-01T11:00:00.00Z') },
};

export const decorators = [
    Story => (
        <Provider store={store}>
            <MockSecuredFinanceProvider>
                <Story />
            </MockSecuredFinanceProvider>
        </Provider>
    ),
    withPerformance,
    withMockDate,
];

export const mobileParameters = {
    viewport: {
        defaultViewport: 'iphone12',
    },
    layout: 'fullscreen',
};

export const tabletParameters = {
    viewport: {
        defaultViewport: 'ipad',
    },
    layout: 'fullscreen',
};
