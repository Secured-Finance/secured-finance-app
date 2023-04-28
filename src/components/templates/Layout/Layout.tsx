export const Layout = ({
    navBar,
    children,
    footer,
}: {
    navBar: React.ReactNode;
    children: React.ReactNode;
    footer: React.ReactNode;
}) => {
    return (
        <div
            className='flex h-screen flex-col justify-between overflow-y-auto'
            data-testid='wrapper-div'
        >
            <div>
                <div className='typography-caption-2 bg-horizonBlue/100 p-[1px] text-center text-neutral-8'>
                    You are visiting Secured Finance on testnet
                </div>
                <header>{navBar}</header>
                <main className='pb-8'>{children}</main>
            </div>
            <footer>{footer}</footer>
        </div>
    );
};
