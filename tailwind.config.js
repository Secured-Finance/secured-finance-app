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
        colors: {
            // Colors of the old design. TODO: remove them
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

            // Primary
            universeBlue: '#002133',
            horizonBlue: '#3555AC',
            teal: '#11CABE',
            green: '#5CD167',
            orange: '#F9AA4B',
            red: '#FA2256',
            purple: '#BD47FB',
            gunMetal: '#292D3F',

            // Secondary
            galacticOrange: '#F9AA4B',
            planetaryPurple: '#ADB6FF',
            nebulaTeal: '#15D6E8',
            secondaryPurple: '#AE72FF',
            moonGrey: '#E6E6E6',

            neutral: '#353945',

            transparent: 'transparent',
            starBlue: {
                '80': 'rgba(81, 98, 255, 0.8)',
                '60': 'rgba(81, 98, 255, 0.6)',
                '40': 'rgba(81, 98, 255, 0.4)',
                '20': 'rgba(81, 98, 255, 0.2)',
                '10': 'rgba(81, 98, 255, 0.1)',
                DEFAULT: '#5162FF',
            },

            black: {
                DEFAULT: '#000000',
                '90': 'rgba(0, 0, 0, 0.9)',
                '80': 'rgba(0, 0, 0, 0.8)',
                '70': 'rgba(0, 0, 0, 0.7)',
                '60': 'rgba(0, 0, 0, 0.6)',
                '50': 'rgba(0, 0, 0, 0.5)',
                '40': 'rgba(0, 0, 0, 0.4)',
                '30': 'rgba(0, 0, 0, 0.3)',
                '20': 'rgba(0, 0, 0, 0.2)',
                '10': 'rgba(0, 0, 0, 0.1)',
            },
            white: {
                DEFAULT: '#FFFFFF',
                '90': 'rgba(255, 255, 255, 0.9)',
                '80': 'rgba(255, 255, 255, 0.8)',
                '70': 'rgba(255, 255, 255, 0.7)',
                '60': 'rgba(255, 255, 255, 0.6)',
                '50': 'rgba(255, 255, 255, 0.5)',
                '40': 'rgba(255, 255, 255, 0.4)',
                '30': 'rgba(255, 255, 255, 0.3)',
                '20': 'rgba(255, 255, 255, 0.2)',
                '10': 'rgba(255, 255, 255, 0.1)',
            },
        },
        extend: {
            width: {
                'button-xs': '8rem',
                'button-sm': '11rem',
                'button-md': '20rem',
                'button-lg': '40rem',
                '42': '8.5rem',
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
