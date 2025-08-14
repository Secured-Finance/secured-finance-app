import clsx from 'clsx';
import { getCommitHash } from 'src/utils';

export const Layout = ({
    navBar,
    children,
    footer,
    isCampaignPage,
}: {
    navBar: React.ReactNode;
    children: React.ReactNode;
    footer: React.ReactNode;
    isCampaignPage?: boolean;
}) => {
    return (
        <div
            className={clsx(
                'flex h-screen w-full flex-col justify-between',
                !isCampaignPage && 'gap-8',
            )}
            data-testid='wrapper-div'
        >
            <div className='w-full'>
                <header className='sticky top-0 z-30 w-full'>{navBar}</header>
                <main className='w-full'>{children}</main>
            </div>
            <footer
                className={clsx('w-full', {
                    'sticky bottom-0 z-30 bg-neutral-900':
                        getCommitHash() !== '.storybook',
                })}
            >
                {footer}
            </footer>
        </div>
    );
};
