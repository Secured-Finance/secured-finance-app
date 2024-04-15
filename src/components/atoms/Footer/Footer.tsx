import clsx from 'clsx';
import packageJson from 'package.json';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';
import { getCommitHash, getEnvShort, getUsePackageVersion } from 'src/utils';
import { isChipVisibleForEnv } from 'src/utils/displayUtils';
import { useAccount } from 'wagmi';

const getVersion = () => {
    if (getUsePackageVersion() && getCommitHash() !== '.storybook') {
        return packageJson.version;
    }

    return getCommitHash();
};

export const Footer = () => {
    const chainError = useSelector(
        (state: RootState) => state.blockchain.chainError
    );
    const { isConnected } = useAccount();

    return (
        <div
            data-cy='footer'
            className='flex h-9 w-full flex-row items-center gap-3 border-t border-neutral-1 bg-black-20 px-3'
        >
            <span
                className={clsx('h-6px w-6px rounded-full', {
                    'bg-green': isConnected && !chainError,
                    'bg-red': !isConnected || chainError,
                })}
                data-testid='connection-status'
            ></span>
            <div className='typography-caption-2 text-planetaryPurple'>
                <span>{`Secured Finance v${getVersion()} `}</span>
                {isChipVisibleForEnv() && (
                    <span className='capitalize'>{`(${getEnvShort()})`}</span>
                )}
            </div>
        </div>
    );
};
