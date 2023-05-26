import { useMediaQuery } from 'react-responsive';
import { Config } from 'tailwindcss';
import ResolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config.js';

const fullConfig = ResolveConfig(tailwindConfig as unknown as Config);

export const useBreakpoint = (breakpoint: string) => {
    return useMediaQuery({
        query: `(max-width: ${
            fullConfig?.theme?.screens?.[breakpoint as never]
        })`,
    });
};
