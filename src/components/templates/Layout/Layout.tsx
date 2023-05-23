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
            className='tablet:max-tablet:min-w-[768px] flex h-screen min-w-[375px] flex-col justify-between overflow-y-auto desktop:min-w-[1024px]'
            data-testid='wrapper-div'
        >
            <div className='w-full'>
                <header className='w-full'>{navBar}</header>
                <main className='w-full pb-8'>{children}</main>
            </div>
            <footer className='w-full'>{footer}</footer>
        </div>
    );
};
