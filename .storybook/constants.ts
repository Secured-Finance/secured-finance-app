import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

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
    laptop: {
        name: 'Laptop',
        styles: {
            width: '1024px',
            height: '768px',
        },
    },
    desktop: {
        name: 'Desktop',
        styles: {
            width: '1440px',
            height: '1512px',
        },
    },
};

const CHROMATIC_VIEWPORTS = { viewports: [390, 768, 1024, 1440] };

export const RESPONSIVE_PARAMETERS = {
    viewport: {
        disable: false,
        viewports: { ...customViewports, ...INITIAL_VIEWPORTS },
        defaultViewport: 'responsive',
    },
    chromatic: CHROMATIC_VIEWPORTS,
};
