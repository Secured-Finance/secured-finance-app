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
            className='flex h-screen w-screen flex-col justify-between gap-8'
            data-testid='wrapper-div'
        >
            <div className='w-full'>
                <header className='fixed top-0 z-50 w-full backdrop-blur'>
                    {navBar}
                </header>
                {/* The header has a height of h-20, and the main section has a top margin of mt-6. However, since the header is fixed, the actual top margin of the main section is mt-26 after calculation. */}
                <main className='mt-26 w-full'>{children}</main>
            </div>
            <footer className='w-full'>{footer}</footer>
        </div>
    );
};
