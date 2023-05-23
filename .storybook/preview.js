import { MockedProvider } from '@apollo/client/testing';
import '@storybook/addon-console';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { Provider } from 'react-redux';
import 'src/assets/css/index.css';
import { withPerformance } from 'storybook-addon-performance';
import store from './../src/store';
import { MockSecuredFinanceProvider } from './../src/stories/mocks/MockSecuredFinanceProvider';
import { withMockDate } from './decorators';

const customViewports = {
    mobile: {
        name: 'Mobile',
        styles: {
            width: '375px',
            height: '667px',
        },
    },
    tablet: {
        name: 'Tablet',
        styles: {
            width: '768px',
            height: '1024px',
        },
    },
    desktop: {
        name: 'Desktop',
        styles: {
            width: '1440px',
            height: '1024px',
        },
    },
};

export const CHROMATIC_VIEWPORTS = { viewports: [390, 768, 1440] };

export const parameters = {
    actions: { argTypesRegex: '^on.*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },

    viewport: {
        viewports: { ...customViewports, ...INITIAL_VIEWPORTS },
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
