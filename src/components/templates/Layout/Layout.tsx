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
                <header>{navBar}</header>
                <main className='pb-8'>{children}</main>
            </div>
            <footer>{footer}</footer>
        </div>
    );
};
