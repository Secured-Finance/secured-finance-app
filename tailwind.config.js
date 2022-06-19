const { lineHeight } = require('tailwindcss/defaultTheme');
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
        fontSize: {
            '5xl': ['86px', { lineHeight: '96px', letterSpacing: '-0.02em' }],
            '4xl': ['54px', { lineHeight: '64px', letterSpacing: '-0.02em' }],
            '3xl': ['42px', { lineHeight: '52px', letterSpacing: '-0.02em' }],
            '2xl': ['36px', { lineHeight: '42px', letterSpacing: '-0.02em' }],
            xl: ['32px', { lineHeight: '40px', letterSpacing: '-0.01em' }],
            lg: ['28px', { lineHeight: '36px', letterSpacing: '-0.01em' }],
            md: ['24px', { lineHeight: '32px', letterSpacing: '-0.01em' }],
            smd: ['20px', { lineHeight: '25px' }],
            base: '16px',
            sm: '14px',
            xs: '12px',
            '2xs': ['10px', { lineHeight: '15px' }],
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

                // Primary
                universeBlue: '#002133',
                horizonBlue: '#3555AC',
                teal: '#11CABE',
                green: '#5CD167',
                orange: '#F9AA4B',
                red: '#FA2256',
                purple: '#BD47FB',

                // Secondary
                galacticOrange: '#F9AA4B',
                planetaryPurple: '#ADB6FF',
                nebulaTeal: '#15D6E8',
                secondaryPurple: '#AE72FF',
                moonGrey: '#E6E6E6',

                white: '#FFFFFF',
                black: '#000000',

                starBlue: {
                    DEFAULT: '#5162FF',
                    '100': '#e8a838',
                    '200': '#e8a838',
                },
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
