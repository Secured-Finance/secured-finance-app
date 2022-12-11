export const Layout = ({
    navBar,
    children,
}: {
    navBar: React.ReactNode;
    children: React.ReactNode;
}) => {
    return (
        <div
            className='h-screen overflow-y-auto pb-8'
            data-testid='wrapper-div'
        >
            <header>{navBar}</header>
            <main>{children}</main>
        </div>
    );
};
