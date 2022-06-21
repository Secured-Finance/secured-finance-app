import '../src/index.css';

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
    backgrounds: {
        default: 'secfin',
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
                name: 'secfin',
                value: '#0b1925',
            },
            {
                name: 'blue',
                value: '#174e7a',
            },
        ],
    },
    chromatic: { disableSnapshot: true },
};
