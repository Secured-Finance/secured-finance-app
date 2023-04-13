import packageJson from 'package.json';
import { getEnvShort } from 'src/utils';

export const Footer = () => {
    return (
        <div
            data-cy='footer'
            className='flex h-9 w-full flex-row items-center gap-3 border-t border-neutral-1 bg-black-20 px-3 '
        >
            <span className='h-6px w-6px rounded-full bg-green'></span>
            <div className='typography-caption-2 text-planetaryPurple'>
                <span>{`Secured Finance v${packageJson.version} `}</span>
                <span className='capitalize'>{`(${getEnvShort()})`}</span>
            </div>
        </div>
    );
};
