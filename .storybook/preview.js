import { MockedProvider } from '@apollo/client/testing';
import '@storybook/addon-console';
import { Provider } from 'react-redux';
import 'src/assets/css/index.css';
import { withPerformance } from 'storybook-addon-performance';
import store from './../src/store';
import { MockSecuredFinanceProvider } from './../src/stories/mocks/MockSecuredFinanceProvider';
import { WithMockDate } from './decorators';

export const parameters = {
    actions: { argTypesRegex: '^on.*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
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
    date: new Date('2022-02-01T11:00:00.00Z'),
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
    WithMockDate,
];
