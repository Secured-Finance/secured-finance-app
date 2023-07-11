import { useMediaQuery } from 'react-responsive';

const config = {
    tablet: '767px',
    laptop: '1023px',
    desktop: '1439px',
};

export const useBreakpoint = (breakpoint: string) => {
    return useMediaQuery({
        query: `(max-width: ${config[breakpoint as never]})`,
    });
};
