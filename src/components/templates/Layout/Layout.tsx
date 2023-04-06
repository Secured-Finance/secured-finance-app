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
            <div className='typography-caption-2 bg-horizonBlue/100 p-[1px] text-center text-neutral-8'>
                You are visiting Secured Finance on testnet
            </div>
            <header>{navBar}</header>
            <main>{children}</main>
        </div>
    );
};
