const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    darkMode: 'media',
    purge: ['./src/**/*.{ts,tsx,js,jsx}'],
    theme: {
        fontFamily: {
            primary: ['GT Super Display', ...defaultTheme.fontFamily.serif],
            secondary: [
                'Suisse International',
                ...defaultTheme.fontFamily.sans,
            ],
        },
        extend: {
            colors: {
                background: '#060609',
                lightBackground: '#FFFFFF',
                darkGrey: '#1a1b1f',
                strokeGrey: '#27282f',
                turquoise: '#38afa8',
                darkPurple: '#5b50de',
                bluePurple: '#4557fb',
                brightBlue: '#4faaff',
                lightGrey: '#7a7c89',
                middleGrey: '#9496a3',
                lightSilver: '#b9b9c2',
                darkenedBg: '#122735',
                tableHeader: '#122735',
                tableBorder: '#1c303f',

                // colors for the design system\
                // generated with https://tailwind.simeongriggs.dev/
                primary: {
                    '50': '#ECEBFA',
                    '100': '#D9D7F4',
                    '200': '#B3AEEA',
                    '300': '#8E86DF',
                    '400': '#685ED4',
                    '500': '#4338CA',
                    '600': '#352BA1',
                    '700': '#282079',
                    '800': '#1A1551',
                    '900': '#0D0B28',
                },
                secondary: {
                    '50': '#E3EBF2',
                    '100': '#C4D5E3',
                    '200': '#8AAAC7',
                    '300': '#5180A9',
                    '400': '#375672',
                    '500': '#1A2936',
                    '600': '#16222D',
                    '700': '#0F171F',
                    '800': '#0A1015',
                    '900': '#05080A',
                },
            },
            fontSize: {
                subhead: '0.875rem',
            },
            width: {
                'button-xs': '8rem',
                'button-sm': '11rem',
                'button-md': '20rem',
                'button-lg': '40rem',
            },
            height: {
                'button-xs': '2.25rem',
                'button-sm': '2.25rem',
                'button-md': '4rem',
                'button-lg': '4rem',
            },
        },
    },
    plugins: [],
};
