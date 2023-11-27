import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';
import { getMainnetChainId } from 'src/utils';

export const Layout = ({
    navBar,
    children,
    footer,
}: {
    navBar: React.ReactNode;
    children: React.ReactNode;
    footer: React.ReactNode;
}) => {
    const chainError = useSelector(
        (state: RootState) => state.blockchain.chainError
    );
    const currentChainId = useSelector(
        (state: RootState) => state.blockchain.chainId
    );
    const mainnetChainId = getMainnetChainId();
    const isShowHeaderMessage =
        currentChainId && (chainError || currentChainId !== mainnetChainId);
    // HeaderMessage is 22px,after calculation, the top margin of the main section is 7.875rem with the HeaderMessage, and 6.5rem without the HeaderMessage.
    const marginTop = isShowHeaderMessage ? 'mt-header-top' : 'mt-26';
    return (
        <div
            className='flex h-screen w-screen flex-col justify-between gap-8'
            data-testid='wrapper-div'
        >
            <div className='w-full'>
                <header className='fixed top-0 z-50 w-full bg-universeBlue'>
                    {navBar}
                </header>
                {/* The header has a height of h-20, and the main section has a top margin of mt-6. However, since the header is fixed, the actual top margin of the main section is mt-26 after calculation. */}
                <main className={classNames('w-full', marginTop)}>
                    {children}
                </main>
            </div>
            <footer className='w-full'>{footer}</footer>
        </div>
    );
};
