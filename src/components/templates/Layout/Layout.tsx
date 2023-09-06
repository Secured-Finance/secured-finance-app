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
                <header className='w-full'>{navBar}</header>
                <main className='w-full'>{children}</main>
            </div>
            <footer className='w-full'>{footer}</footer>
        </div>
    );
};
